#!/bin/bash

echo "🚀 Запуск VitaSync в фоновом режиме"
echo "================================="

cd /root/vitasync-telegram-webapp

# Останавливаем предыдущие процессы
echo "🛑 Остановка предыдущих процессов..."
pkill -f "node src/index.js" || true

# Загружаем переменные окружения
set -a
source .env
set +a

# Экспортируем переменные для подпроцессов
export DATABASE_URL
export TELEGRAM_BOT_TOKEN
export TELEGRAM_WEBAPP_URL
export OPENAI_API_KEY
export JWT_SECRET
export REDIS_URL
export NODE_ENV

# Создаем директорию для логов
mkdir -p logs

# Запускаем backend в фоне
cd backend
echo "🚀 Запуск backend..."
nohup node src/index.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend запущен с PID: $BACKEND_PID"
echo "📁 Логи сохраняются в: /root/vitasync-telegram-webapp/logs/backend.log"
echo ""
echo "📊 Для просмотра логов используйте:"
echo "   tail -f /root/vitasync-telegram-webapp/logs/backend.log"
echo ""
echo "🛑 Для остановки используйте:"
echo "   kill $BACKEND_PID"
echo ""
echo "✨ Бот запущен и работает в фоновом режиме!"