const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const openAIService = require('../services/openai');
const { getDb } = require('../services/database');
const { logger } = require('../utils/logger');

// Analyze supplements compatibility
router.post('/compatibility', [
  body('supplements').isString().notEmpty(),
  body('modelType').optional().isIn(['standard', 'premium'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { supplements, modelType = 'standard' } = req.body;
    const userId = req.user.userId;
    
    // Check if user has premium access for premium model
    if (modelType === 'premium' && !req.user.isPremium) {
      return res.status(403).json({ 
        error: 'Premium model requires premium subscription' 
      });
    }
    
    // Perform analysis
    const result = await openAIService.analyzeCompatibility(
      supplements,
      userId,
      modelType
    );
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json({
      analysis: result.analysis,
      model: result.model,
      limitInfo: result.limitInfo
    });
    
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Get user's analysis history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const sql = getDb();
    
    const history = await sql`
      SELECT 
        id,
        model,
        prompt as supplements,
        response as analysis,
        created_at
      FROM ai_requests
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    res.json({ history });
    
  } catch (error) {
    logger.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get user's current limits
router.get('/limits', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const standardLimit = await openAIService.checkUserLimit(userId, 'standard');
    const premiumLimit = await openAIService.checkUserLimit(userId, 'premium');
    
    res.json({
      standard: standardLimit,
      premium: premiumLimit
    });
    
  } catch (error) {
    logger.error('Error checking limits:', error);
    res.status(500).json({ error: 'Failed to check limits' });
  }
});

// Get quick suggestions for a category
router.post('/suggestions', [
  body('category').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { category } = req.body;
    const userId = req.user.userId;
    
    const result = await openAIService.getQuickSuggestions(category, userId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json({ suggestions: result.suggestions });
    
  } catch (error) {
    logger.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

module.exports = router;