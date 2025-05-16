const postgres = require('postgres');
const { logger } = require('../utils/logger');

let sql;

async function initDatabase() {
  try {
    sql = postgres(process.env.DATABASE_URL);
    
    // Test connection
    await sql`SELECT 1`;
    
    logger.info('Database connected successfully');
    
    // Create tables if not exist
    await createTables();
    
    return sql;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

async function createTables() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        language_code VARCHAR(10) DEFAULT 'ru',
        is_bot BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Supplements table
    await sql`
      CREATE TABLE IF NOT EXISTS supplements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        active_ingredients JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Compatibility matrix
    await sql`
      CREATE TABLE IF NOT EXISTS compatibility (
        id SERIAL PRIMARY KEY,
        supplement1_id INT REFERENCES supplements(id),
        supplement2_id INT REFERENCES supplements(id),
        compatibility_level VARCHAR(20) CHECK (compatibility_level IN ('good', 'neutral', 'bad')),
        interaction_type VARCHAR(50),
        description TEXT,
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(supplement1_id, supplement2_id)
      )
    `;
    
    // User supplements
    await sql`
      CREATE TABLE IF NOT EXISTS user_supplements (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        supplement_id INT REFERENCES supplements(id),
        dosage VARCHAR(100),
        frequency VARCHAR(100),
        time_of_day VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // User schedules
    await sql`
      CREATE TABLE IF NOT EXISTS user_schedules (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        schedule_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // AI requests tracking
    await sql`
      CREATE TABLE IF NOT EXISTS ai_requests (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        model VARCHAR(50),
        prompt TEXT,
        response TEXT,
        tokens_used INT,
        cost DECIMAL(10, 6),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Daily request limits
    await sql`
      CREATE TABLE IF NOT EXISTS user_limits (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        model VARCHAR(50),
        date DATE DEFAULT CURRENT_DATE,
        requests_count INT DEFAULT 0,
        last_request_at TIMESTAMP,
        UNIQUE(user_id, model, date)
      )
    `;
    
    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Failed to create tables:', error);
    throw error;
  }
}

function getDb() {
  if (!sql) {
    throw new Error('Database not initialized');
  }
  return sql;
}

module.exports = {
  initDatabase,
  getDb
};