const express = require('express');
const router = express.Router();
const { getDb } = require('../services/database');
const { logger } = require('../utils/logger');

// Get all supplements
router.get('/', async (req, res) => {
  try {
    const sql = getDb();
    const supplements = await sql`
      SELECT * FROM supplements 
      ORDER BY name ASC
    `;
    res.json({ supplements });
  } catch (error) {
    logger.error('Error fetching supplements:', error);
    res.status(500).json({ error: 'Failed to fetch supplements' });
  }
});

// Search supplements
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const sql = getDb();
    
    const supplements = await sql`
      SELECT * FROM supplements 
      WHERE name ILIKE ${'%' + q + '%'}
      ORDER BY name ASC
      LIMIT 10
    `;
    
    res.json({ supplements });
  } catch (error) {
    logger.error('Error searching supplements:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get supplement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = getDb();
    
    const [supplement] = await sql`
      SELECT * FROM supplements 
      WHERE id = ${id}
    `;
    
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found' });
    }
    
    res.json({ supplement });
  } catch (error) {
    logger.error('Error fetching supplement:', error);
    res.status(500).json({ error: 'Failed to fetch supplement' });
  }
});

module.exports = router;