#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting StudyMate..."

# Start server
echo "Starting server on http://localhost:5000..."
cd "$DIR/server" && node server.js &
SERVER_PID=$!

sleep 2

# Start client
echo "Starting client on http://localhost:5173..."
cd "$DIR/client" && npx vite --port 5173 &
CLIENT_PID=$!

echo ""
echo "StudyMate is running!"
echo "  Server: http://localhost:5000"
echo "  Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both."

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait
