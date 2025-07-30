#!/bin/bash

echo "🚀 Starting SysRegister in Development Mode"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Optional: Add your ClasseViva credentials
# CLASSEVIVA_USERNAME=your_username
# CLASSEVIVA_PASSWORD=your_password

# Development Configuration
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
EOL
    echo "✅ Created .env.local file"
    echo ""
fi

echo "🔧 Starting development server..."
echo "📱 The app will be available at: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
