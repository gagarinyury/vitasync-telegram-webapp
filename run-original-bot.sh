#!/bin/bash

echo "🤖 Запуск оригинального VitaSync бота"
echo "====================================="

cd /root/vitasync-telegram-webapp

# Останавливаем все предыдущие процессы
echo "🛑 Остановка предыдущих процессов..."
pkill -f "node.*bot" || true

# Загружаем переменные окружения
set -a
source .env
set +a

# Запускаем полное приложение
cd backend
echo ""
echo "🚀 Запуск VitaSync..."
echo "📱 Токен бота: ${TELEGRAM_BOT_TOKEN:0:20}..."
echo "🌐 WebApp URL: $TELEGRAM_WEBAPP_URL"
echo ""
echo "Логи в реальном времени:"
echo "========================"
node src/index.js