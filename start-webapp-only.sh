#!/bin/bash

echo "🚀 Запуск VitaSync WebApp (без бота)"
echo "=================================="

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
set -o allexport
source .env
set +o allexport

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

# Установка зависимостей если нужно
echo "📦 Проверка зависимостей..."
npm install --legacy-peer-deps

# Установка зависимостей для backend
echo "📦 Установка зависимостей backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей backend..."
    npm install --legacy-peer-deps
fi

# Установка зависимостей для frontend
echo "📦 Установка зависимостей frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей frontend..."
    npm install --legacy-peer-deps
fi

# Запуск backend
echo ""
echo "🚀 Запуск backend API..."
cd ../backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Ждем запуска backend
sleep 3

# Запуск frontend
echo ""
echo "🚀 Запуск frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Показываем статус
echo ""
echo "✅ Статус:"
echo "- Backend API: PID $BACKEND_PID (порт 3000)"
echo "- Frontend: PID $FRONTEND_PID (порт 5173)"
echo ""
echo "🌐 WebApp доступен по адресу: http://localhost:5173"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ждем завершения
wait