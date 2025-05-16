#!/bin/bash

echo "🚀 Запуск VitaSync для онлайн доступа"
echo "===================================="

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
source .env

# Остановка предыдущих процессов
echo "🛑 Остановка предыдущих процессов..."
pkill -f "node.*backend" || true
pkill -f "vite" || true

# Создаем директорию для логов
mkdir -p logs

# Запуск backend
echo "🚀 Запуск backend API..."
cd backend
# Экспортируем переменные окружения для backend
export OPENAI_API_KEY="$OPENAI_API_KEY"
export DATABASE_URL="$DATABASE_URL"
export TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN"
export JWT_SECRET="$JWT_SECRET"
export REDIS_URL="$REDIS_URL"
nohup npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend запущен (PID: $BACKEND_PID)"

sleep 3

# Запуск frontend для онлайн доступа
echo "🚀 Запуск frontend для онлайн..."
cd ../frontend
VITE_API_URL=https://profy.top/api nohup npm run dev -- --host > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend запущен (PID: $FRONTEND_PID)"

# Сохраняем PID
echo $BACKEND_PID > ../backend.pid
echo $FRONTEND_PID > ../frontend.pid

# Проверяем логи через несколько секунд
sleep 5

echo ""
echo "✅ Сервисы запущены!"
echo "- Backend API: http://localhost:3000"
echo "- Frontend: http://0.0.0.0:5173"
echo ""
echo "🌐 Доступ через домен: https://profy.top/webapp"
echo ""
echo "📋 Логи:"
echo "- tail -f logs/backend.log"
echo "- tail -f logs/frontend.log"
echo ""
echo "🛑 Для остановки: ./stop-webapp.sh"