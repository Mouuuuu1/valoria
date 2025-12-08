#!/bin/bash

echo "🚀 Starting Valorina servers..."

# Start backend
cd /Users/moustafakhalid/Desktop/architecture/backend
echo "Starting backend on port 5001..."
npm run dev > /tmp/valorina-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd /Users/moustafakhalid/Desktop/architecture/frontend
echo "Starting frontend on port 3000..."
npm run dev > /tmp/valorina-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "✅ Servers started!"
echo "Backend PID: $BACKEND_PID (http://localhost:5001)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:3000)"
echo ""
echo "To view logs:"
echo "  Backend:  tail -f /tmp/valorina-backend.log"
echo "  Frontend: tail -f /tmp/valorina-frontend.log"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
