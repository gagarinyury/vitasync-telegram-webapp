const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const supplementRoutes = require('./supplements');
const analysisRoutes = require('./analysis');
const userRoutes = require('./users');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/supplements', authenticateToken, supplementRoutes);
router.use('/analysis', authenticateToken, analysisRoutes);
router.use('/users', authenticateToken, userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;