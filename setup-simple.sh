#!/bin/bash

# Простой setup скрипт для VitaSync

echo "🚀 VitaSync - Быстрая настройка"
echo "=============================="
echo ""

# Генерация случайных строк
DB_PASS=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)
JWT_SEC=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

echo "📝 Введите необходимые данные:"
echo ""

read -p "1. Telegram Bot Token (от @BotFather): " BOT_TOKEN
read -p "2. OpenAI API Key (sk-...): " OPENAI_KEY
read -p "3. Ваш домен (example.com): " DOMAIN

# Создание .env
cat > .env << EOF
# Database
DB_PASSWORD=$DB_PASS
DATABASE_URL=postgres://vitasync:$DB_PASS@postgres:5432/vitasync_db

# Telegram
TELEGRAM_BOT_TOKEN=$BOT_TOKEN
TELEGRAM_WEBAPP_URL=https://$DOMAIN/webapp

# OpenAI
OPENAI_API_KEY=$OPENAI_KEY

# JWT
JWT_SECRET=$JWT_SEC

# Redis
REDIS_URL=redis://redis:6379

# Node
NODE_ENV=production

# Domain
DOMAIN=$DOMAIN
EOF

# Обновление Caddyfile
sed -i "s/example.com/$DOMAIN/g" Caddyfile

echo ""
echo "✅ Готово! Файлы настроены."
echo ""
echo "📋 Дальнейшие шаги:"
echo "1. Настройте DNS для $DOMAIN"
echo "2. Запустите: docker-compose up -d"
echo "3. В @BotFather: /setwebapp → https://$DOMAIN/webapp"
echo ""
echo "🔑 Сохраните эти данные:"
echo "DB Password: $DB_PASS"
echo "JWT Secret: $JWT_SEC"
echo ""

chmod +x setup-simple.sh