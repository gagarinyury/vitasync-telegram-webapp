require('dotenv').config();
const { initBot } = require('./backend/src/services/telegram-bot');
const { initDatabase } = require('./backend/src/services/database');
const { logger } = require('./backend/src/utils/logger');

async function startBot() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');
    
    // Initialize Telegram bot
    await initBot();
    logger.info('Telegram bot initialized');
    
    // Keep the process running
    logger.info('Bot is running...');
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

startBot();