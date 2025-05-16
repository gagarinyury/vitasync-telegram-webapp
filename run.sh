#!/bin/bash

cd /root/vitasync-telegram-webapp

# Load environment variables
source .env

# Stop old processes
pkill -f vite || true

echo "Starting frontend..."
cd frontend && npm run dev -- --host &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"
echo ""
echo "✅ Services running:"
echo "- Backend: https://profy.top/api/health"
echo "- Frontend: https://profy.top/webapp/"
echo ""
echo "Press Ctrl+C to stop"

# Wait for the process
wait $FRONTEND_PID