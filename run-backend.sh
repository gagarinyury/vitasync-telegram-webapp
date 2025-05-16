#!/bin/bash

echo "🚀 Запуск VitaSync Backend"
echo "========================"

cd /root/vitasync-telegram-webapp

# Загружаем переменные окружения
set -a
source .env
set +a

# Проверяем сервисы
echo "📊 Проверка зависимостей..."
echo "PostgreSQL: $(sudo systemctl is-active postgresql)"
echo "Redis: $(sudo systemctl is-active redis-server)"

# Запускаем backend
cd backend
echo ""
echo "🚀 Запуск backend..."
echo "API URL: https://profy.top/api"
echo "Bot URL: https://t.me/YOUR_BOT_USERNAME"
echo ""
node src/index.js