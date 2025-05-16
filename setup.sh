#!/bin/bash

# VitaSync Telegram WebApp Setup Script

echo "========================================="
echo "  VitaSync Telegram WebApp Setup"
echo "========================================="
echo ""

# Function to generate random string
generate_random_string() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-$1
}

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  Файл .env уже существует."
    read -p "Хотите перезаписать его? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Отменено."
        exit 0
    fi
fi

echo "Этот скрипт поможет вам настроить все необходимые переменные окружения."
echo ""

# Telegram Bot Token
echo "1. TELEGRAM BOT TOKEN"
echo "   Это токен вашего бота, который вы получили от @BotFather"
echo "   Формат: 1234567890:ABCDefGHijKLMnOPQrSTUvWXYz123456789"
echo ""
read -p "Введите Telegram Bot Token: " TELEGRAM_BOT_TOKEN

# OpenAI API Key
echo ""
echo "2. OPENAI API KEY"
echo "   Это ключ API от OpenAI для использования GPT моделей"
echo "   Получить можно на: https://platform.openai.com/api-keys"
echo "   Формат: sk-..."
echo ""
read -p "Введите OpenAI API Key: " OPENAI_API_KEY

# Database Password
echo ""
echo "3. DATABASE PASSWORD"
echo "   Это пароль для PostgreSQL базы данных"
echo "   Рекомендуется использовать сложный пароль"
echo ""
read -p "Хотите сгенерировать случайный пароль? (y/n): " generate_db_pass
if [ "$generate_db_pass" = "y" ]; then
    DB_PASSWORD=$(generate_random_string 24)
    echo "   Сгенерирован пароль: $DB_PASSWORD"
else
    read -s -p "Введите пароль для базы данных: " DB_PASSWORD
    echo ""
fi

# JWT Secret
echo ""
echo "4. JWT SECRET"
echo "   Это секретный ключ для подписи JWT токенов"
echo "   Должен быть случайной строкой для безопасности"
echo ""
read -p "Хотите сгенерировать случайный секрет? (y/n): " generate_jwt
if [ "$generate_jwt" = "y" ]; then
    JWT_SECRET=$(generate_random_string 32)
    echo "   Сгенерирован секрет: $JWT_SECRET"
else
    read -s -p "Введите JWT секрет: " JWT_SECRET
    echo ""
fi

# Domain
echo ""
echo "5. DOMAIN"
echo "   Домен для вашего приложения (например: vitasync.example.com)"
echo ""
read -p "Введите домен: " DOMAIN

# WebApp URL
TELEGRAM_WEBAPP_URL="https://$DOMAIN/webapp"

# Redis URL
REDIS_URL="redis://redis:6379"

# Database URL
DATABASE_URL="postgres://vitasync:$DB_PASSWORD@postgres:5432/vitasync_db"

# Node Environment
NODE_ENV="production"

# Create .env file
cat > .env << EOF
# Database
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=$DATABASE_URL

# Telegram
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_WEBAPP_URL=$TELEGRAM_WEBAPP_URL

# OpenAI
OPENAI_API_KEY=$OPENAI_API_KEY

# JWT
JWT_SECRET=$JWT_SECRET

# Redis
REDIS_URL=$REDIS_URL

# Node
NODE_ENV=$NODE_ENV

# Domain for SSL
DOMAIN=$DOMAIN
EOF

echo ""
echo "✅ Файл .env успешно создан!"
echo ""
echo "========================================="
echo "Что дальше?"
echo "========================================="
echo ""
echo "1. Обновите Caddyfile - замените example.com на $DOMAIN"
echo "   sed -i 's/example.com/$DOMAIN/g' Caddyfile"
echo ""
echo "2. Настройте DNS записи для $DOMAIN"
echo "   A запись: $DOMAIN → IP вашего сервера"
echo ""
echo "3. Запустите приложение:"
echo "   docker-compose up -d"
echo ""
echo "4. Настройте WebApp URL в Telegram:"
echo "   Отправьте @BotFather команду:"
echo "   /setwebapp"
echo "   Выберите вашего бота и введите URL:"
echo "   $TELEGRAM_WEBAPP_URL"
echo ""
echo "5. Проверьте логи:"
echo "   docker-compose logs -f"
echo ""
echo "========================================="
echo "Важная информация:"
echo "========================================="
echo ""
echo "Пароль БД: $DB_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo ""
echo "⚠️  СОХРАНИТЕ ЭТИ ДАННЫЕ В БЕЗОПАСНОМ МЕСТЕ!"
echo ""

# Make setup script executable
chmod +x setup.sh