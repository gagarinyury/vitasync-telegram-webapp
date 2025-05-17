# VitaSync Telegram WebApp

VitaSync - это Telegram WebApp для анализа совместимости витаминов и БАДов с использованием AI.

## 🚀 Быстрый старт

### Требования
- Node.js 16+
- PostgreSQL с базой данных
- Telegram Bot Token
- OpenAI API Key
- SSL сертификаты для домена

### Установка зависимостей
```bash
cd /root/vitasync-telegram-webapp
npm install  # Устанавливает все зависимости через workspaces
```

### Запуск в режиме разработки

#### Frontend (порт 5173)
```bash
cd frontend
npm run dev
```

#### Backend (порт 3000)
```bash
# Способ 1: С переменными окружения
source .env && cd backend && npm run dev

# Способ 2: Через workspace (рекомендуется)
cd /root/vitasync-telegram-webapp
npm run dev:backend
```

⚠️ **ВАЖНО**: Перед запуском проверьте свободность портов!
```bash
# Проверка занятости портов
sudo lsof -i :3000  # для backend
sudo lsof -i :5173  # для frontend

# Если порт занят, остановите процесс
kill -9 <PID>
```

### Production окружение

Проект настроен для работы на домене `profy.top` с SSL сертификатами.

#### Структура проксирования (Caddy):
- `https://profy.top/webapp/` → `localhost:5173` (Frontend)
- `https://profy.top/api/` → `localhost:3000` (Backend API)

#### Проверка состояния:
```bash
sudo systemctl status caddy
curl https://profy.top/api/health
```

## 📁 Структура проекта

```
/root/vitasync-telegram-webapp/
├── frontend/          # React приложение (порт 5173)
├── backend/           # Express API (порт 3000)
├── bot-only.js       # Отдельный Telegram бот
├── Caddyfile         # Конфигурация reverse proxy
├── .env              # Переменные окружения
├── CLAUDE.md         # Документация для AI-ассистента
└── README.md         # Этот файл
```

## ⚙️ Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBAPP_URL=https://profy.top/webapp/

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vitasync

# API Keys
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
```

## 🛠 Команды разработки

### Линтинг и тесты
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
cd backend && npm test
```

### Git workflow
```bash
# Проверка статуса
git status

# Создание коммита
git add .
git commit -m "Your message"

# Push в репозиторий
git push origin main
```

## 🐛 Решение проблем

### Порт уже занят
```bash
# Найти процесс
sudo lsof -i :3000

# Освободить порт
kill -9 <PID>
```

### База данных не подключается
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что PostgreSQL запущен
- Проверьте пароль пользователя БД

### Frontend не запускается
- Убедитесь, что порт 5173 свободен
- Проверьте, что npm install выполнен успешно
- Запустите из корня проекта

### Backend ошибки
- Проверьте все переменные окружения в `.env`
- Убедитесь, что порт 3000 свободен
- Проверьте логи: `cd backend && npm run dev`

## 📱 Использование

1. Откройте бота в Telegram: `@vitasync_bot`
2. Нажмите `/start`
3. Откройте WebApp по кнопке
4. Добавьте витамины/БАДы
5. Получите анализ совместимости

## 🔒 Безопасность

- SSL сертификаты обязательны для Telegram WebApp
- JWT токены для авторизации
- Telegram init data валидация
- Не коммитьте `.env` файл!

## 📝 Дополнительная документация

Подробная техническая документация находится в файле `CLAUDE.md`.

## 🚦 Статус сервисов

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`
- Production: `https://profy.top/webapp/`

## ⚡ Быстрые команды

```bash
# Запуск всего проекта
cd /root/vitasync-telegram-webapp
npm run dev:backend  # В первом терминале
cd frontend && npm run dev  # Во втором терминале

# Проверка работоспособности
curl http://localhost:3000/api/health

# Логи Caddy
sudo journalctl -u caddy -f
```

---

Если возникли проблемы, проверьте `CLAUDE.md` для детальной информации или создайте issue в репозитории.