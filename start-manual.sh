#!/bin/bash

echo "🚀 Запуск VitaSync WebApp (ручной режим)"
echo "======================================"

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
set -o allexport
source .env
set +o allexport

# Запуск backend
echo ""
echo "🚀 Запуск backend API..."
cd backend
./node_modules/.bin/nodemon src/index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Ждем запуска backend
sleep 3

# Запуск frontend
echo ""
echo "🚀 Запуск frontend..."
cd ../frontend
./node_modules/.bin/vite --host &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Показываем статус
echo ""
echo "✅ Статус:"
echo "- Backend API: PID $BACKEND_PID (порт 3000)"
echo "- Frontend: PID $FRONTEND_PID (порт 5173)"
echo ""
echo "🌐 WebApp доступен по адресу: http://localhost:5173/webapp/"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ждем завершения
wait