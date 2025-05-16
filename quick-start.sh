#!/bin/bash

echo "🚀 Быстрый запуск VitaSync"
echo "========================"

cd /root/vitasync-telegram-webapp

# Загрузка переменных окружения
source .env

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

# Проверка Redis
echo "🔧 Запуск Redis..."
sudo systemctl start redis-server
sudo systemctl status redis-server --no-pager

# База данных уже создана

# Установка зависимостей и запуск backend
echo ""
echo "📦 Установка зависимостей backend..."
cd backend
npm install

echo ""
echo "🚀 Запуск backend..."
node src/index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Ждем запуска backend
sleep 5

# Проверяем логи
echo ""
echo "📝 Логи backend:"
sleep 2

# Показываем статус
echo ""
echo "✅ Статус:"
echo "- Backend PID: $BACKEND_PID"
echo "- PostgreSQL: $(sudo systemctl is-active postgresql)"
echo "- Redis: $(sudo systemctl is-active redis-server)"
echo ""
echo "🔗 Веб-интерфейс должен быть доступен по адресу:"
echo "   https://profy.top/webapp"
echo ""
echo "🤖 Бот должен отвечать на команды в Telegram"
echo ""
echo "📝 Чтобы остановить backend, используйте:"
echo "   kill $BACKEND_PID"
echo ""
echo "📊 Наблюдайте за логами в реальном времени:"