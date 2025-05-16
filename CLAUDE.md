# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## VitaSync Telegram WebApp

VitaSync - это Telegram WebApp для анализа совместимости витаминов и БАДов с использованием AI.

## Essential Commands

### Development - ✅ WORKING

#### Frontend (WebApp) - ✅ FULLY FUNCTIONAL
```bash
# Установка зависимостей (из корня проекта)
cd /root/vitasync-telegram-webapp
npm install  # Устанавливает все зависимости через workspaces

# Запуск frontend
cd frontend
npm run dev
```

#### Backend API - ✅ WORKING
```bash
# Способ 1: С переменными окружения
source .env && cd backend && npm run dev

# Способ 2: Через workspace (рекомендуется)
cd /root/vitasync-telegram-webapp
npm run dev:backend

# Проверка работоспособности
curl http://localhost:3000/api/health
```

#### Telegram Bot - ⚠️ TO BE CONFIGURED
```bash
# НЕ запускается автоматически, требует отдельной настройки
./run-bot-only.sh  # Будет настроен позже
```

### Testing & Linting
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
cd backend && npm test
```

### Production - ✅ CONFIGURED
```bash
# SSL сертификаты настроены в двух местах:
# - /root/ssl-certs/SSL Сертификаты/
# - /etc/caddy/SSL Сертификаты/

# Caddy работает и проксирует:
# https://profy.top/webapp/ → localhost:5173
# https://profy.top/api/ → localhost:3000

# Проверка состояния:
sudo systemctl status caddy
curl -k https://profy.top/webapp/
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
1. Backend использует dotenv для автозагрузки переменных окружения
2. Frontend НЕ должен запускаться с флагом --host ❗
3. Telegram требует валидный SSL для WebApp
4. Caddy проксирует:
   - /webapp/* → localhost:5173
   - /api/* → localhost:3000
5. Backend запускается на порту 3000, обязательна проверка свободности порта

### Common Issues & Solutions ✅
1. Backend не видит env переменные → теперь dotenv подключен автоматически
2. Telegram bot ошибка "invalid URL" → проверить TELEGRAM_WEBAPP_URL
3. SSL ошибки → сертификаты есть в обоих местах:
   - `/root/ssl-certs/SSL Сертификаты/`
   - `/etc/caddy/SSL Сертификаты/`
4. Port already in use → `sudo lsof -i :PORT` затем `kill -9 PID`
5. Vite не устанавливается → запускать `npm install` из корня (workspaces)
6. Vite блокирует profy.top → добавить в `allowedHosts` в vite.config.js
7. База данных не подключается → проверить пароль пользователя в PostgreSQL
8. OpenAI API не работает → проверить OPENAI_API_KEY в .env файле

### Development Tips
1. НЕ используйте ./start-webapp-only.sh (проблемы с установкой зависимостей)
2. Запускайте frontend и backend отдельно
3. Frontend автоматически перезагружается при изменениях
4. Backend использует nodemon для авто-рестарта
5. При проблемах с vite всегда проверяйте занятые порты

### Vite Configuration ✅
```javascript
// frontend/vite.config.js
{
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: ['profy.top', 'localhost'],  // Критично для работы через Caddy
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  base: '/webapp/',
}
```

### Security Notes
- JWT токены для авторизации
- Telegram init data валидация
- SSL обязателен для production
- Не коммитить .env файл