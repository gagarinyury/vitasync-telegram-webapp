# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## VitaSync Telegram WebApp

VitaSync - это Telegram WebApp для анализа совместимости витаминов и БАДов с использованием AI.

## Essential Commands

### Development
```bash
# Frontend + Backend одновременно
cd /root/vitasync-telegram-webapp
./start-webapp-only.sh

# Или по отдельности:
# Frontend
cd frontend && npm run dev -- --host

# Backend с переменными окружения
source .env && cd backend && npm run dev

# Telegram Bot (только бот)
./run-bot-only.sh
```

### Testing & Linting
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
cd backend && npm test
```

### Production
```bash
# SSL сертификаты в /root/ssl-certs/SSL Сертификаты/
# Caddy конфигурация для profy.top
sudo systemctl reload caddy

# Доступ:
# https://profy.top/webapp/
# https://profy.top/api/health
```

## High-Level Architecture

### System Components
1. **Telegram Bot** (telegraf)
   - Точка входа через Telegram
   - Команда /start создает WebApp URL
   - Сохраняет пользователей в PostgreSQL

2. **Frontend** (React + Vite)
   - Material UI для компонентов
   - Zustand для состояния
   - Telegram WebApp SDK интеграция
   - Запущен на порту 5173

3. **Backend API** (Express.js)
   - JWT авторизация через Telegram init data
   - REST API для webapp
   - Интеграция с OpenAI для анализа
   - Запущен на порту 3000

4. **Infrastructure**
   - Caddy: Reverse proxy с SSL (profy.top)
   - PostgreSQL: База данных пользователей
   - Валидные SSL сертификаты для Telegram

### Data Flow
1. User → Telegram Bot → Получает WebApp URL
2. User → Открывает WebApp → Авторизация через Telegram
3. Frontend → API запросы → Backend
4. Backend → OpenAI API → Анализ совместимости
5. Результаты → PostgreSQL → Frontend

### Key Directories
```
/root/vitasync-telegram-webapp/
├── frontend/           # React приложение
├── backend/            # Express API
├── bot-only.js        # Отдельный бот
├── Caddyfile          # Caddy конфигурация
└── .env               # Переменные окружения
```

### Environment Variables
Критичные переменные в .env:
- TELEGRAM_BOT_TOKEN
- TELEGRAM_WEBAPP_URL=https://profy.top/webapp/
- OPENAI_API_KEY
- DATABASE_URL
- JWT_SECRET

### UI Components
- HomePage: Основная страница для добавления добавок
- AnalysisPage: Результаты анализа совместимости
- MainMenuPage: Красивое меню с карточками
- ProfilePage: Профиль пользователя
- SchedulePage: График приема (заглушка)

### Important Patterns
1. Всегда использовать source .env перед запуском backend
2. Frontend должен запускаться с флагом --host
3. Telegram требует валидный SSL для WebApp
4. Caddy проксирует:
   - /webapp/* → localhost:5173
   - /api/* → localhost:3000

### Common Issues
1. Backend не видит env переменные → source .env
2. Telegram bot ошибка "invalid URL" → проверить TELEGRAM_WEBAPP_URL
3. SSL ошибки → сертификаты в /root/ssl-certs/
4. Port already in use → pkill -f node

### Development Tips
1. Используйте ./start-webapp-only.sh для быстрого запуска
2. Логи в /root/vitasync-telegram-webapp/logs/
3. Frontend автоматически перезагружается при изменениях
4. Backend использует nodemon для авто-рестарта

### Security Notes
- JWT токены для авторизации
- Telegram init data валидация
- SSL обязателен для production
- Не коммитить .env файл