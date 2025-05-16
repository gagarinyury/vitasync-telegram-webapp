#!/bin/bash

# Локальный запуск VitaSync без Docker

echo "🚀 Запуск VitaSync локально..."

# Проверяем наличие .env
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    exit 1
fi

# Загружаем переменные окружения
source .env

# Запускаем PostgreSQL и Redis если не запущены
echo "📦 Проверка сервисов..."
sudo systemctl start postgresql
sudo systemctl start redis-server

# Запускаем backend
echo "🔧 Запуск backend..."
cd backend
(npm run dev) &
BACKEND_PID=$!
cd ..

# Запускаем frontend
echo "🌐 Запуск frontend..."
cd frontend
(npm run dev) &
FRONTEND_PID=$!
cd ..

echo "✅ Приложение запущено!"
echo "Frontend: http://localhost:5173/webapp/"
echo "Backend: http://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ждем завершения
wait $BACKEND_PID $FRONTEND_PID