#!/bin/bash

echo "🚀 SysRegister Self-Hosting Setup"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Optional: Add your ClasseViva credentials
# CLASSEVIVA_USERNAME=your_username
# CLASSEVIVA_PASSWORD=your_password

# App Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOL
    echo "✅ Created .env.local file"
fi

# Build and run with Docker Compose
echo "🔨 Building and starting SysRegister..."
docker-compose up -d --build

echo ""
echo "🎉 SysRegister is now running!"
echo "📱 Open your browser and go to: http://localhost:3000"
echo ""
echo "🔧 Management commands:"
echo "  Stop:    docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Logs:    docker-compose logs -f"
echo "  Update:  git pull && docker-compose up -d --build"
echo ""
echo "💡 Self-hosting benefits:"
echo "  ✅ Your own server environment"
echo "  ✅ No WAF restrictions"
echo "  ✅ Same network as your working Node.js script"
echo "  ✅ Full control over configuration"
