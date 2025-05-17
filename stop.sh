#!/bin/bash
# Скрипт для остановки VitaSync проекта
# Останавливает backend и frontend сервисы

echo "🛑 Остановка VitaSync проекта..."

# Остановка процессов по PID файлам
if [ -f "/tmp/vitasync-backend.pid" ]; then
    BACKEND_PID=$(cat /tmp/vitasync-backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo "⏹️  Остановка backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm /tmp/vitasync-backend.pid
    else
        echo "⚠️  Backend процесс не найден (PID: $BACKEND_PID)"
        rm /tmp/vitasync-backend.pid
    fi
else
    echo "⚠️  Файл PID для backend не найден"
fi

if [ -f "/tmp/vitasync-frontend.pid" ]; then
    FRONTEND_PID=$(cat /tmp/vitasync-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo "⏹️  Остановка frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm /tmp/vitasync-frontend.pid
    else
        echo "⚠️  Frontend процесс не найден (PID: $FRONTEND_PID)"
        rm /tmp/vitasync-frontend.pid
    fi
else
    echo "⚠️  Файл PID для frontend не найден"
fi

# Дополнительная проверка портов
echo ""
echo "🔍 Проверка портов..."

# Проверка порта 3000
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Порт 3000 все еще занят, принудительная очистка..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null
fi

# Проверка порта 5173
if lsof -i :5173 >/dev/null 2>&1; then
    echo "⚠️  Порт 5173 все еще занят, принудительная очистка..."
    lsof -ti :5173 | xargs kill -9 2>/dev/null
fi

# Очистка временных файлов
echo "🧹 Очистка временных файлов..."
rm -f /tmp/vitasync-backend.log
rm -f /tmp/vitasync-frontend.log

echo ""
echo "✅ VitaSync успешно остановлен!"
echo ""
echo "🚀 Для запуска используйте: ./start.sh"