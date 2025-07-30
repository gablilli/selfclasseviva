#!/bin/bash

echo "🚀 Starting SysRegister in production mode..."
echo "📍 This will run on http://localhost:3000"
echo ""

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

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Optional: Add your ClasseViva credentials
# CLASSEVIVA_USERNAME=your_username
# CLASSEVIVA_PASSWORD=your_password

# Production Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOL
    echo "✅ Created .env.local file"
    echo ""
fi

echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting production server..."
    echo "📱 The app will be available at: http://localhost:3000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    
    # Start the production server
    npm start
else
    echo "❌ Build failed!"
    exit 1
fi
