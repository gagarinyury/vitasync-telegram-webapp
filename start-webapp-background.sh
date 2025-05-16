#!/bin/bash

echo "🚀 Запуск VitaSync WebApp в фоновом режиме"
echo "========================================"

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
source .env

# Остановка предыдущих процессов если есть
echo "🛑 Останавливаем предыдущие процессы..."
pkill -f "node.*backend" || true
pkill -f "node.*frontend" || true

# Запуск backend в фоне
echo "🚀 Запуск backend API..."
cd backend && nohup npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend запущен (PID: $BACKEND_PID)"

# Ждем запуска backend
sleep 3

# Запуск frontend в фоне
echo "🚀 Запуск frontend..."
cd ../frontend && nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend запущен (PID: $FRONTEND_PID)"

# Сохраняем PID
echo $BACKEND_PID > ../backend.pid
echo $FRONTEND_PID > ../frontend.pid

# Показываем статус
echo ""
echo "✅ WebApp успешно запущен!"
echo "- Backend API: http://localhost:3000 (PID: $BACKEND_PID)"
echo "- Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "📋 Логи можно посмотреть:"
echo "- tail -f logs/backend.log"
echo "- tail -f logs/frontend.log"
echo ""
echo "🛑 Для остановки используйте: ./stop-webapp.sh"