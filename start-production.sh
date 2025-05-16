#!/bin/bash

# VitaSync - Production запуск без Docker

echo "🚀 Запуск VitaSync в production режиме"
echo "===================================="

# Проверка PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL не установлен"
    echo "Устанавливаем PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# Проверка Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis не установлен"
    echo "Устанавливаем Redis..."
    sudo apt install -y redis-server
    sudo systemctl start redis-server
fi

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js не установлен"
    echo "Устанавливаем Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Загрузка переменных окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Создание БД если не существует
echo "📦 Настройка базы данных..."
sudo -u postgres psql <<EOF
CREATE DATABASE vitasync_db;
CREATE USER vitasync WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE vitasync_db TO vitasync;
EOF

# Установка зависимостей
cd /root/vitasync-telegram-webapp
npm install

cd backend
npm install

cd ../frontend
npm install
npm run build

# Создание systemd сервиса для backend
echo "🔧 Создание systemd сервиса..."
cat > /etc/systemd/system/vitasync-backend.service <<EOF
[Unit]
Description=VitaSync Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/vitasync-telegram-webapp/backend
Environment="NODE_ENV=production"
EnvironmentFile=/root/vitasync-telegram-webapp/.env
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Перезагрузка systemd и запуск сервиса
systemctl daemon-reload
systemctl enable vitasync-backend
systemctl start vitasync-backend

# Настройка Caddy
echo "🔧 Настройка Caddy..."
mkdir -p /var/www/vitasync
cp -r /root/vitasync-telegram-webapp/frontend/dist/* /var/www/vitasync/

# Перезапуск Caddy
caddy reload --config /root/vitasync-telegram-webapp/Caddyfile

echo ""
echo "✅ VitaSync успешно запущен!"
echo ""
echo "📍 WebApp URL: https://profy.top/webapp"
echo "📍 API URL: https://profy.top/api"
echo ""
echo "📊 Проверка статуса:"
echo "systemctl status vitasync-backend"
echo ""
echo "📝 Логи:"
echo "journalctl -u vitasync-backend -f"