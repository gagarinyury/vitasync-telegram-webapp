const OpenAI = require('openai');
const { logger } = require('../utils/logger');
const { getDb } = require('./database');
const fs = require('fs').promises;
const path = require('path');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.models = {
      standard: 'gpt-4o-mini',
      premium: 'gpt-4-1106-preview' // Note: Using available model as gpt-4.1-mini doesn't exist
    };
    this.dailyLimits = {
      standard: null, // Unlimited
      premium: 2
    };
  }

  async loadPharmacologyPrompt() {
    try {
      const promptPath = path.join(__dirname, '../../../docs/pharmacology-prompt.md');
      const prompt = await fs.readFile(promptPath, 'utf-8');
      return prompt;
    } catch (error) {
      logger.error('Failed to load pharmacology prompt:', error);
      throw error;
    }
  }

  async checkUserLimit(userId, modelType = 'standard') {
    const sql = getDb();
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const [userLimit] = await sql`
        SELECT requests_count 
        FROM user_limits 
        WHERE user_id = ${userId} 
          AND model = ${modelType}
          AND date = ${today}
      `;
      
      const limit = this.dailyLimits[modelType];
      
      if (limit && userLimit && userLimit.requests_count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          message: `Вы достигли дневного лимита запросов для ${modelType} режима (${limit} запросов в день)`
        };
      }
      
      const remaining = limit ? limit - (userLimit?.requests_count || 0) : null;
      
      return {
        allowed: true,
        remaining,
        message: remaining ? `Осталось запросов сегодня: ${remaining}` : 'Неограниченное количество запросов'
      };
    } catch (error) {
      logger.error('Error checking user limit:', error);
      throw error;
    }
  }

  async incrementUserLimit(userId, modelType) {
    const sql = getDb();
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await sql`
        INSERT INTO user_limits (user_id, model, date, requests_count, last_request_at)
        VALUES (${userId}, ${modelType}, ${today}, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, model, date)
        DO UPDATE SET 
          requests_count = user_limits.requests_count + 1,
          last_request_at = CURRENT_TIMESTAMP
      `;
    } catch (error) {
      logger.error('Error incrementing user limit:', error);
      throw error;
    }
  }

  async analyzeCompatibility(supplements, userId, modelType = 'standard') {
    try {
      // Check user limit
      const limitCheck = await this.checkUserLimit(userId, modelType);
      if (!limitCheck.allowed) {
        throw new Error(limitCheck.message);
      }
      
      // Load pharmacology prompt
      const systemPrompt = await this.loadPharmacologyPrompt();
      
      // Prepare user prompt
      const userPrompt = supplements;
      
      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.models[modelType],
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      const response = completion.choices[0].message.content;
      const tokensUsed = completion.usage.total_tokens;
      
      // Log the request
      const sql = getDb();
      await sql`
        INSERT INTO ai_requests (user_id, model, prompt, response, tokens_used)
        VALUES (${userId}, ${this.models[modelType]}, ${userPrompt}, ${response}, ${tokensUsed})
      `;
      
      // Increment user limit
      await this.incrementUserLimit(userId, modelType);
      
      return {
        success: true,
        analysis: response,
        model: this.models[modelType],
        limitInfo: await this.checkUserLimit(userId, modelType)
      };
      
    } catch (error) {
      logger.error('Error analyzing compatibility:', error);
      return {
        success: false,
        error: error.message,
        model: this.models[modelType]
      };
    }
  }

  async getQuickSuggestions(category, userId) {
    try {
      const prompt = `
        Предложи 5 популярных ${category} добавок с кратким описанием их пользы.
        Формат ответа: название - краткое описание пользы.
      `;
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ты эксперт по БАДам и витаминам. Отвечай кратко и по делу.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      
      return {
        success: true,
        suggestions: completion.choices[0].message.content
      };
      
    } catch (error) {
      logger.error('Error getting suggestions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new OpenAIService();