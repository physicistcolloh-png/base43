#!/bin/bash

# base43 - Setup and Installation Script
# This script sets up the entire base43 platform locally

set -e

echo "🚀 base43 Platform Setup"
echo "========================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"
cd ..

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start development:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm start"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "🎯 First steps:"
echo "1. Register a new account"
echo "2. Try 'build a todo app'"
echo "3. Select integrations"
echo "4. View live preview"
echo ""
