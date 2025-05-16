#!/bin/bash

echo "🚀 Установка и запуск Frontend"
echo "============================"

cd /root/vitasync-telegram-webapp/frontend

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Сборка frontend
echo "🔨 Сборка frontend..."
export VITE_API_URL=https://profy.top
npm run build

# Создание директории для Caddy
echo "📁 Создание директории для статических файлов..."
sudo mkdir -p /var/www/vitasync
sudo cp -r dist/* /var/www/vitasync/

# Перезапуск Caddy
echo "🔄 Перезапуск Caddy..."
sudo caddy reload --config /root/vitasync-telegram-webapp/Caddyfile

echo ""
echo "✅ Frontend готов!"
echo "🔗 WebApp доступен по адресу: https://profy.top/webapp"