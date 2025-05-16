#!/bin/bash

# Быстрый запуск dev-среды

echo "🚀 Запуск dev-среды VitaSync..."

# Проверяем наличие .env
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    exit 1
fi

# Останавливаем старые контейнеры
docker compose down

# Запускаем в dev режиме (автоматически используется override)
docker compose up

# Для запуска в фоне добавьте -d:
# docker compose up -d