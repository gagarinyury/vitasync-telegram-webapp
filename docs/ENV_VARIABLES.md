# Переменные окружения VitaSync

## Обязательные переменные

### 1. TELEGRAM_BOT_TOKEN
- **Что это**: Токен вашего Telegram бота
- **Где получить**: У @BotFather в Telegram
- **Формат**: `1234567890:ABCDefGHijKLMnOPQrSTUvWXYz123456789`
- **Как получить**:
  1. Напишите @BotFather команду `/newbot`
  2. Следуйте инструкциям
  3. Скопируйте полученный токен

### 2. OPENAI_API_KEY
- **Что это**: Ключ API для доступа к OpenAI GPT моделям
- **Где получить**: https://platform.openai.com/api-keys
- **Формат**: `sk-...` (начинается с sk-)
- **Как получить**:
  1. Зарегистрируйтесь на OpenAI
  2. Перейдите в раздел API Keys
  3. Создайте новый ключ

### 3. DB_PASSWORD
- **Что это**: Пароль для PostgreSQL базы данных
- **Где получить**: Вы придумываете сами
- **Рекомендации**:
  - Минимум 16 символов
  - Используйте буквы, цифры, спецсимволы
  - Можно сгенерировать: `openssl rand -base64 24`
- **Пример**: `MyStr0ngP@ssw0rd!2024`

### 4. JWT_SECRET
- **Что это**: Секретный ключ для подписи JWT токенов аутентификации
- **Где получить**: Вы генерируете сами
- **Рекомендации**:
  - Минимум 32 символа
  - Должен быть случайным
  - Можно сгенерировать: `openssl rand -base64 32`
- **Пример**: `xvz9j82ndk3o5mxn7qwe8u3jdk92mxbvf`

### 5. DOMAIN
- **Что это**: Ваш домен для приложения
- **Где получить**: У любого регистратора доменов
- **Формат**: `vitasync.example.com` или `yourdomain.com`
- **Важно**: DNS записи должны указывать на ваш сервер

## Автоматически генерируемые переменные

Эти переменные создаются автоматически на основе введенных данных:

- **DATABASE_URL**: Строка подключения к БД
  ```
  postgres://vitasync:${DB_PASSWORD}@postgres:5432/vitasync_db
  ```

- **TELEGRAM_WEBAPP_URL**: URL вашего WebApp
  ```
  https://${DOMAIN}/webapp
  ```

- **REDIS_URL**: Строка подключения к Redis
  ```
  redis://redis:6379
  ```

## Примеры

### Пример заполненного .env файла:
```env
# Database
DB_PASSWORD=MySecurePassword123!
DATABASE_URL=postgres://vitasync:MySecurePassword123!@postgres:5432/vitasync_db

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCDefGHijKLMnOPQrSTUvWXYz123456789
TELEGRAM_WEBAPP_URL=https://vitasync.example.com/webapp

# OpenAI
OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwxyz1234567890

# JWT
JWT_SECRET=xvz9j82ndk3o5mxn7qwe8u3jdk92mxbvf

# Redis
REDIS_URL=redis://redis:6379

# Node
NODE_ENV=production

# Domain for SSL
DOMAIN=vitasync.example.com
```

## Безопасность

⚠️ **ВАЖНО**:
- Никогда не коммитьте .env файл в git
- Не делитесь секретными ключами
- Используйте сложные пароли
- Периодически обновляйте JWT_SECRET
- Храните резервные копии в безопасном месте