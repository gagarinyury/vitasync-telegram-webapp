#!/bin/bash

cd /root/vitasync-telegram-webapp

# Load environment variables
source .env

# Kill old backend
pkill -f 'node.*src/index.js' || true

# Export all variables
export OPENAI_API_KEY="$OPENAI_API_KEY"
export DATABASE_URL="$DATABASE_URL"
export TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN"
export TELEGRAM_WEBAPP_URL="$TELEGRAM_WEBAPP_URL"
export JWT_SECRET="$JWT_SECRET"
export REDIS_URL="$REDIS_URL"

# Show what we're using
echo "Using TELEGRAM_WEBAPP_URL: $TELEGRAM_WEBAPP_URL"

# Start backend
cd backend
npm run dev