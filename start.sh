#!/bin/bash

echo "🚀 Starting Dynamic UBI Simulator..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

# Kill any existing processes on ports 3000 and 5001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Get the project root directory
PROJECT_ROOT=$(pwd)

# Start the backend server
echo "🔧 Starting backend server..."
cd "$PROJECT_ROOT/server" && node index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend connection
echo "🔍 Testing backend connection..."
if curl -s http://localhost:5001/api/economic-data > /dev/null; then
    echo "✅ Backend server running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID
    exit 1
fi

# Start the frontend
echo "🎨 Starting frontend application..."
cd "$PROJECT_ROOT/client" && npm start &
FRONTEND_PID=$!

# Wait for frontend to compile
sleep 15

echo ""
echo "🎉 Dynamic UBI Simulator is ready!"
echo "=================================="
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5001"
echo ""
echo "🎮 Demo Features:"
echo "• Real-time economic data updates every 30 seconds"
echo "• Interactive simulation controls"
echo "• Pre-configured scenarios (Crisis, Boom, Disaster)"  
echo "• AI transparency and reporting"
echo "• Export functionality (JSON/CSV)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Keep script running
wait