#!/bin/bash

echo "🚀 SysRegister Deployment Script"
echo "================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if command_exists node; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check for npm
if command_exists npm; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo ""
echo "Choose deployment method:"
echo "1) Development server (recommended for testing)"
echo "2) Production build"
echo "3) Docker (if available)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Starting development server..."
        chmod +x run-dev.sh
        ./run-dev.sh
        ;;
    2)
        echo "🏗️ Building for production..."
        chmod +x run-local.sh
        ./run-local.sh
        ;;
    3)
        if command_exists docker; then
            echo "🐳 Starting with Docker..."
            docker compose up -d --build
            echo "✅ Application should be running on http://localhost:3000"
            echo "📋 View logs: docker compose logs -f"
            echo "🛑 Stop: docker compose down"
        else
            echo "❌ Docker not found. Falling back to local development..."
            chmod +x run-dev.sh
            ./run-dev.sh
        fi
        ;;
    *)
        echo "❌ Invalid choice. Starting development server..."
        chmod +x run-dev.sh
        ./run-dev.sh
        ;;
esac
