#!/bin/bash

# VitaSync - скрипт запуска без Docker

echo "🚀 Запуск VitaSync без Docker"
echo "============================"

# Установка зависимостей
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Установите Node.js и npm"
    exit 1
fi

# Установка зависимостей backend
echo "📦 Установка зависимостей backend..."
cd backend
npm install

# Установка зависимостей frontend
echo "📦 Установка зависимостей frontend..."
cd ../frontend
npm install

# Сборка frontend
echo "🔨 Сборка frontend..."
npm run build

# Запуск backend
echo "🚀 Запуск backend..."
cd ../backend
npm start &
BACKEND_PID=$!

# Запуск frontend в dev режиме (для разработки)
echo "🚀 Запуск frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ VitaSync запущен!"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "📍 URL приложения: https://profy.top/webapp"
echo "📍 API endpoint: https://profy.top/api"
echo ""
echo "Для остановки используйте:"
echo "kill $BACKEND_PID $FRONTEND_PID"