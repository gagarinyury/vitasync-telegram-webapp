#!/bin/bash

cd /root/vitasync-telegram-webapp/frontend

# Kill any existing vite process
pkill -f vite || true

# Start vite in the background
nohup npm run dev -- --host > ../logs/frontend.log 2>&1 &

echo "Frontend started with PID: $!"
echo "Logs: tail -f /root/vitasync-telegram-webapp/logs/frontend.log"