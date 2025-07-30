#!/bin/bash

echo "🚀 SysRegister Deployment Script"
echo "================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Ask user for deployment method
echo ""
echo "Choose deployment method:"
echo "1) Development mode (npm run dev)"
echo "2) Production mode (npm run build && npm start)"
echo "3) Docker (recommended)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Starting development mode..."
        chmod +x run-dev.sh
        ./run-dev.sh
        ;;
    2)
        echo "🏗️ Starting production mode..."
        chmod +x run-local.sh
        ./run-local.sh
        ;;
    3)
        echo "🐳 Starting Docker deployment..."
        docker compose down
        docker compose up -d --build
        echo ""
        echo "✅ SysRegister is now running!"
        echo "🌐 Open: http://localhost:3000"
        echo "📊 Logs: docker compose logs -f sysregister"
        echo "🛑 Stop: docker compose down"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "🌐 Access your app at: http://localhost:3000"
