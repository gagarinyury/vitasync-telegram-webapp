#!/bin/bash

cd /root/vitasync-telegram-webapp/backend

# Load environment variables
source ../.env

# Export required variables
export OPENAI_API_KEY="$OPENAI_API_KEY"
export DATABASE_URL="$DATABASE_URL"
export TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN"
export TELEGRAM_WEBAPP_URL="$TELEGRAM_WEBAPP_URL"
export JWT_SECRET="$JWT_SECRET"
export REDIS_URL="$REDIS_URL"

# Kill any existing backend process
pkill -f "node.*backend" || true

# Start backend in the background
nohup npm run dev > ../logs/backend.log 2>&1 &

echo "Backend started with PID: $!"
echo "Logs: tail -f /root/vitasync-telegram-webapp/logs/backend.log"