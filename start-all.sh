#!/bin/bash

cd /root/vitasync-telegram-webapp

echo "🚀 Starting VitaSync services..."

# Kill any existing frontend processes
pkill -f vite || true
pkill -f "npm.*dev.*frontend" || true

# Start frontend in background
echo "Starting frontend..."
cd frontend && nohup npm run dev -- --host > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

# Check services
echo ""
echo "📋 Service Status:"
echo -n "Backend: "
curl -s -k https://profy.top/api/health | jq -r '.status' 2>/dev/null || echo "not available"

echo -n "Frontend: "
curl -s -I http://localhost:5173/webapp/ | head -1 | cut -d' ' -f2 2>/dev/null || echo "not available"

echo ""
echo "🌐 Access URLs:"
echo "- App: https://profy.top/webapp/"
echo "- API: https://profy.top/api/health"
echo ""
echo "📋 Logs:"
echo "- Frontend: tail -f /root/vitasync-telegram-webapp/logs/frontend.log"
echo "- Backend: tail -f /root/vitasync-telegram-webapp/logs/backend.log"