#!/bin/bash

# ============================================
# CODESPACES STARTUP SCRIPT
# Automatically starts both backend and frontend
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     AI APP BUILDER - GitHub Codespaces Startup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠️  .env file not found!${NC}"
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo -e "${GREEN}✅ .env created${NC}"
  echo -e "${YELLOW}Please update .env with your API keys and Codespace URL${NC}"
  exit 1
fi

# Get Codespace name if running in Codespaces
if [ -n "$CODESPACE_NAME" ]; then
  echo -e "${GREEN}✅ Running in GitHub Codespace${NC}"
  echo -e "  Codespace Name: ${BLUE}$CODESPACE_NAME${NC}"
  echo -e "  Backend URL: ${BLUE}https://$CODESPACE_NAME-5000.app.github.dev${NC}"
  echo -e "  Frontend URL: ${BLUE}https://$CODESPACE_NAME-3000.app.github.dev${NC}"
  echo ""
  
  # Suggest .env update if needed
  if grep -q "localhost:5000" .env; then
    echo -e "${YELLOW}⚠️  .env still has localhost URLs${NC}"
    echo "Update REACT_APP_API_URL to:"
    echo -e "  ${BLUE}REACT_APP_API_URL=https://$CODESPACE_NAME-5000.app.github.dev${NC}"
    echo ""
  fi
fi

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Start Backend
echo -e "${BLUE}───────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}Starting Backend Server...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────${NC}"

cd backend

if [ ! -d node_modules ]; then
  echo "Installing backend dependencies..."
  npm install > /dev/null 2>&1
  echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

# Start backend in background
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 3

# Test backend health
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend health check passed${NC}"
else
  echo -e "${YELLOW}⚠️  Backend may still be initializing...${NC}"
fi

echo ""

# Start Frontend
echo -e "${BLUE}───────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}Starting Frontend Server...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────${NC}"

cd ../frontend

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install > /dev/null 2>&1
  echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

# Start frontend
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Both servers are starting!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

if [ -n "$CODESPACE_NAME" ]; then
  echo -e "${BLUE}Frontend will be available at:${NC}"
  echo -e "${GREEN}  https://$CODESPACE_NAME-3000.app.github.dev${NC}"
  echo ""
else
  echo -e "${BLUE}Frontend will be available at:${NC}"
  echo -e "${GREEN}  http://localhost:3000${NC}"
  echo ""
fi

echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
