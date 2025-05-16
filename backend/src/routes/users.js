const express = require('express');
const router = express.Router();
const { getDb } = require('../services/database');
const { logger } = require('../utils/logger');

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const sql = getDb();
    
    const [user] = await sql`
      SELECT id, telegram_id, username, first_name, last_name, is_premium, created_at
      FROM users
      WHERE id = ${userId}
    `;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName } = req.body;
    const sql = getDb();
    
    const [updatedUser] = await sql`
      UPDATE users
      SET 
        first_name = ${firstName},
        last_name = ${lastName},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, telegram_id, username, first_name, last_name, is_premium
    `;
    
    res.json({ user: updatedUser });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's supplements
router.get('/supplements', async (req, res) => {
  try {
    const userId = req.user.userId;
    const sql = getDb();
    
    const supplements = await sql`
      SELECT 
        us.id,
        us.dosage,
        us.frequency,
        us.time_of_day,
        s.id as supplement_id,
        s.name,
        s.category,
        s.description
      FROM user_supplements us
      JOIN supplements s ON us.supplement_id = s.id
      WHERE us.user_id = ${userId}
      ORDER BY s.name ASC
    `;
    
    res.json({ supplements });
  } catch (error) {
    logger.error('Error fetching user supplements:', error);
    res.status(500).json({ error: 'Failed to fetch supplements' });
  }
});

// Add supplement to user
router.post('/supplements', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { supplementId, dosage, frequency, timeOfDay } = req.body;
    const sql = getDb();
    
    const [userSupplement] = await sql`
      INSERT INTO user_supplements (user_id, supplement_id, dosage, frequency, time_of_day)
      VALUES (${userId}, ${supplementId}, ${dosage}, ${frequency}, ${timeOfDay})
      RETURNING id
    `;
    
    res.json({ 
      success: true,
      userSupplementId: userSupplement.id 
    });
  } catch (error) {
    logger.error('Error adding user supplement:', error);
    res.status(500).json({ error: 'Failed to add supplement' });
  }
});

// Remove supplement from user
router.delete('/supplements/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const sql = getDb();
    
    await sql`
      DELETE FROM user_supplements 
      WHERE id = ${id} AND user_id = ${userId}
    `;
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error removing user supplement:', error);
    res.status(500).json({ error: 'Failed to remove supplement' });
  }
});

module.exports = router;