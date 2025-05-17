const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../services/database');
const { logger } = require('../utils/logger');

// Функция очистки данных пользователя
function sanitizeUserData(user) {
  return {
    id: user.id,
    username: user.username || null,
    first_name: user.first_name || 'User',
    last_name: user.last_name || null,
    language_code: user.language_code || 'ru',
    is_bot: user.is_bot || false,
    is_premium: user.is_premium || false
  };
}

// Telegram WebApp authentication
router.post('/telegram', [
  body('initData').notEmpty(),
  body('hash').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { initData, hash } = req.body;
    
    // Verify Telegram data
    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get('user'));
    
    // TODO: Implement proper Telegram hash verification
    // For now, we'll trust the data for MVP
    
    // Логирование входящих данных
    logger.info('Telegram auth attempt:', {
      userId: user.id,
      hasUsername: !!user.username,
      hasLastName: !!user.last_name
    });
    
    // Очистка данных пользователя
    const cleanedUser = sanitizeUserData(user);
    
    const sql = getDb();
    
    // Get or create user
    const [dbUser] = await sql`
      INSERT INTO users (telegram_id, username, first_name, last_name, language_code, is_bot, is_premium)
      VALUES (
        ${cleanedUser.id}, 
        ${cleanedUser.username}, 
        ${cleanedUser.first_name}, 
        ${cleanedUser.last_name}, 
        ${cleanedUser.language_code}, 
        ${cleanedUser.is_bot}, 
        ${cleanedUser.is_premium}
      )
      ON CONFLICT (telegram_id) 
      DO UPDATE SET 
        username = ${cleanedUser.username},
        first_name = ${cleanedUser.first_name},
        last_name = ${cleanedUser.last_name},
        is_premium = ${cleanedUser.is_premium},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: dbUser.id,
        telegramId: dbUser.telegram_id,
        isPremium: dbUser.is_premium
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        id: dbUser.id,
        telegramId: dbUser.telegram_id,
        username: dbUser.username,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        isPremium: dbUser.is_premium
      }
    });
    
  } catch (error) {
    logger.error('Auth error:', error);
    
    if (error.code === 'UNDEFINED_VALUE') {
      return res.status(400).json({ 
        error: 'Некорректные данные пользователя',
        details: 'Убедитесь, что у вас актуальная версия Telegram'
      });
    }
    
    res.status(500).json({ 
      error: 'Ошибка авторизации',
      details: 'Попробуйте позже или обратитесь в поддержку'
    });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sql = getDb();
    
    const [user] = await sql`
      SELECT id, telegram_id, username, first_name, last_name, is_premium
      FROM users
      WHERE id = ${decoded.userId}
    `;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      valid: true,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isPremium: user.is_premium
      }
    });
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;