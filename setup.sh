#!/bin/bash

echo "🔧 Setting up SysRegister..."

# Make scripts executable
chmod +x deploy.sh
chmod +x run-dev.sh
chmod +x run-local.sh

echo "✅ Scripts are now executable"
echo ""
echo "🚀 Quick start options:"
echo "  ./run-dev.sh     - Development server"
echo "  ./run-local.sh   - Production build"
echo "  ./deploy.sh      - Interactive deployment"
echo ""
echo "📖 For more info, see QUICK_START.md"
