#!/bin/bash

echo "🚀 Запуск VitaSync WebApp"
echo "========================="

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
set -o allexport
source .env
set +o allexport

# Убиваем предыдущие процессы
pkill -f "node.*backend" || true
pkill -f "node.*frontend" || true
pkill -f vite || true

# Запуск backend
echo ""
echo "🚀 Запуск backend API..."
cd backend
npx nodemon src/index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Ждем запуска backend
sleep 5

# Запуск frontend
echo ""
echo "🚀 Запуск frontend..."
cd ../frontend
npx vite --host &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Показываем статус
echo ""
echo "✅ Статус:"
echo "- Backend API: PID $BACKEND_PID (порт 3000)"
echo "- Frontend: PID $FRONTEND_PID (порт 5173)"
echo ""
echo "🌐 WebApp доступен по адресу: https://profy.top/webapp/"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Обработка завершения
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT TERM

# Ждем завершения
wait