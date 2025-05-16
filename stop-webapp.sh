#!/bin/bash

echo "🛑 Остановка VitaSync WebApp"
echo "=========================="

# Читаем PID из файлов
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    echo "Останавливаем backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "Backend уже остановлен"
    rm backend.pid
fi

if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    echo "Останавливаем frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "Frontend уже остановлен"
    rm frontend.pid
fi

# Дополнительная проверка
pkill -f "node.*backend" || true
pkill -f "node.*frontend" || true

echo "✅ WebApp остановлен"