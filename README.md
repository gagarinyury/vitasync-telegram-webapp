# VitaSync Telegram WebApp

VitaSync - это Telegram WebApp для анализа совместимости витаминов и БАДов с помощью AI.

## Основные возможности

- 🔍 Анализ совместимости витаминов и БАДов через OpenAI API
- 📅 Создание персонального графика приема
- 🤖 Интеграция с Telegram Bot API
- 🚀 Два режима AI: стандартный (неограниченный) и премиум (2 запроса в день)
- 💾 Сохранение истории анализов

## Технический стек

### Backend
- Node.js + Express
- PostgreSQL для данных
- Redis для кеширования
- Telegraf для Telegram Bot
- OpenAI API для анализа
- Socket.io для real-time обновлений

### Frontend
- React 18
- Material UI
- Telegram WebApp SDK
- Zustand для state management
- React Query для кеширования

### Инфраструктура
- Docker + Docker Compose
- Caddy для reverse proxy и SSL
- JWT для аутентификации

## Установка и запуск

### 1. Клонирование репозитория

\`\`\`bash
git clone https://github.com/yourusername/vitasync-telegram-webapp.git
cd vitasync-telegram-webapp
\`\`\`

### 2. Настройка переменных окружения

\`\`\`bash
cp .env.example .env
\`\`\`

Заполните .env файл:
- \`TELEGRAM_BOT_TOKEN\` - токен вашего Telegram бота
- \`OPENAI_API_KEY\` - ключ OpenAI API
- \`JWT_SECRET\` - секретный ключ для JWT
- \`DB_PASSWORD\` - пароль для PostgreSQL

### 3. Запуск через Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Разработка

Для локальной разработки:

\`\`\`bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev
\`\`\`

### 5. Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Настройте WebApp URL через команду:
   \`/setwebapp https://yourdomain.com/webapp\`
3. Включите inline mode если нужно

### 6. Настройка Caddy для SSL

1. Замените \`example.com\` в Caddyfile на ваш домен
2. Убедитесь что DNS записи настроены правильно
3. Caddy автоматически получит SSL сертификат

## Структура проекта

\`\`\`
vitasync-telegram-webapp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── database/
├── config/
├── docs/
├── docker-compose.yml
├── Caddyfile
└── README.md
\`\`\`

## API Endpoints

### Аутентификация
- \`POST /api/auth/telegram\` - вход через Telegram
- \`GET /api/auth/verify\` - проверка токена

### Анализ
- \`POST /api/analysis/compatibility\` - анализ совместимости
- \`GET /api/analysis/history\` - история анализов
- \`GET /api/analysis/limits\` - проверка лимитов
- \`POST /api/analysis/suggestions\` - получение рекомендаций

### Пользователь
- \`GET /api/users/profile\` - профиль пользователя
- \`PUT /api/users/profile\` - обновление профиля

## Безопасность

- JWT токены для аутентификации
- Rate limiting для API endpoints
- HTTPS через Caddy
- Проверка Telegram hash для WebApp
- Хеширование паролей bcrypt
- Защита от XSS, CSRF, SQL инъекций

## Мониторинг и логи

- Winston для логирования
- Sentry для отслеживания ошибок (опционально)
- Caddy access logs
- Docker logs

## Развертывание

### Производственная среда

1. Настройте переменные окружения
2. Запустите Docker Compose:
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`
3. Настройте Caddy для вашего домена
4. Проверьте логи:
   \`\`\`bash
   docker-compose logs -f
   \`\`\`

## Поддержка

Telegram: @your_support_bot

## Лицензия

MIT