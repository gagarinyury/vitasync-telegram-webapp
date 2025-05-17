#!/bin/bash
# Скрипт для запуска VitaSync проекта
# Запускает backend и frontend сервисы

echo "🚀 Запуск VitaSync проекта..."

# Установка переменной окружения
export NODE_ENV=development

# Проверка занятости портов
if lsof -i :3000 >/dev/null 2>&1; then
    echo "❌ Порт 3000 уже занят! Остановите процесс или используйте stop.sh"
    exit 1
fi

if lsof -i :5173 >/dev/null 2>&1; then
    echo "❌ Порт 5173 уже занят! Остановите процесс или используйте stop.sh"
    exit 1
fi

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Запуск backend в фоне
echo "🟢 Запуск backend (порт 3000)..."
cd backend
npm run dev > /tmp/vitasync-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Небольшая пауза перед запуском frontend
sleep 2

# Запуск frontend в фоне
echo "🟢 Запуск frontend (порт 5173)..."
cd frontend
npm run dev > /tmp/vitasync-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Сохранение PID в файл для остановки
echo $BACKEND_PID > /tmp/vitasync-backend.pid
echo $FRONTEND_PID > /tmp/vitasync-frontend.pid

echo "✅ VitaSync успешно запущен!"
echo ""
echo "📍 Frontend: http://localhost:5173/webapp/"
echo "📍 Backend API: http://localhost:3000/api/"
echo "📍 Production: https://profy.top/webapp/"
echo ""
echo "📄 Логи:"
echo "  - Backend: tail -f /tmp/vitasync-backend.log"
echo "  - Frontend: tail -f /tmp/vitasync-frontend.log"
echo ""
echo "🛑 Для остановки используйте: ./stop.sh"