#!/bin/bash

echo "🚀 Dynamic UBI Simulator - Hackathon Demo Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v14 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js detected: $NODE_VERSION"

# Clean up any existing processes
print_status "Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    print_status "Installing dependencies..."
    npm run install-all
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Create logs directory for backend
mkdir -p server/logs

print_status "Starting backend server..."
cd server && node index.js > ../demo.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Test backend connection
print_status "Testing backend connection..."
if curl -s http://localhost:5001/api/health > /dev/null; then
    print_success "✅ Backend server running on http://localhost:5001"
    
    # Get sample data to verify APIs
    SAMPLE_DATA=$(curl -s http://localhost:5001/api/economic-data)
    UNEMPLOYMENT=$(echo $SAMPLE_DATA | grep -o '"unemployment":[0-9.]*' | cut -d':' -f2)
    print_success "📊 Live economic data working - Unemployment: ${UNEMPLOYMENT}%"
else
    print_error "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

print_status "Starting frontend application..."
cd client && npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to compile
print_status "Waiting for frontend to compile..."
sleep 15

echo ""
print_success "🎉 Dynamic UBI Simulator is ready for demo!"
echo "=============================================="
print_success "🌐 Frontend: http://localhost:3000"
print_success "🔌 Backend API: http://localhost:5001"
print_success "❤️  Health Check: http://localhost:5001/health"
print_success "📊 Metrics: http://localhost:5001/api/metrics"
echo ""

echo "🎮 DEMO FEATURES READY:"
echo "• ✅ Real-time economic data from Federal Reserve"
echo "• ✅ AI sentiment analysis from news"
echo "• ✅ Interactive scenario simulation"
echo "• ✅ Professional UI with animations"
echo "• ✅ Enterprise-grade backend with monitoring"
echo ""

echo "🎤 DEMO TALKING POINTS:"
echo "• Show live data indicator in top-right"
echo "• Run Economic Crisis scenario (UBI jumps to \$4,200+)"
echo "• Demonstrate custom simulation sliders"
echo "• Explain AI transparency in bottom panel"
echo "• Highlight real-time news sentiment impact"
echo ""

print_warning "💡 PRO TIP: Open the demo guide for detailed talking points:"
print_warning "    📖 cat HACKATHON_DEMO.md"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "✅ Cleanup complete"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

print_warning "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait