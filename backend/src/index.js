require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const { initBot } = require('./services/telegram-bot');
const { initDatabase } = require('./services/database');
const { logger } = require('./utils/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.TELEGRAM_WEBAPP_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.TELEGRAM_WEBAPP_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Socket.io handlers
io.on('connection', (socket) => {
  logger.info('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    logger.info('User disconnected:', socket.id);
  });
});

// Error handler
app.use(errorHandler);

// Initialize services
async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    
    // Initialize Telegram bot
    await initBot();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };