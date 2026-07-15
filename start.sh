#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting StudyMate..."

# Start server
echo "Starting server on http://localhost:5000..."
cd "$DIR/server" && node server.js &
SERVER_PID=$!

sleep 3

# Start client
echo "Starting client on http://localhost:5173..."
cd "$DIR/client" && npx vite --port 5173 &
CLIENT_PID=$!

sleep 2

echo ""
echo "StudyMate is running!"
echo "  Landing: http://localhost:5000"
echo "  Notes:   http://localhost:5173"
echo ""
echo "Opening landing page..."
xdg-open http://localhost:5000 2>/dev/null || open http://localhost:5000 2>/dev/null || echo "Open http://localhost:5000 in your browser"
echo ""
echo "Press Ctrl+C to stop both."

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait
