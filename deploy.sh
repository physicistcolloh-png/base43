#!/bin/bash

# Vercel Deployment Helper Script
# This script guides you through the deployment process step by step

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 Vercel Deployment Helper                                 ║"
echo "║  AI App Builder - Production Deployment                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Vercel CLI
echo "✓ Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  echo "✗ Vercel CLI not found. Install with: npm install -g vercel"
  exit 1
fi
echo "✓ Vercel CLI found: $(vercel --version)"
echo ""

# Step 2: Check authentication
echo "✓ Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
  echo "✓ Already authenticated as: $(vercel whoami)"
else
  echo "✗ Not authenticated. Run: vercel login"
  echo ""
  echo "Opening browser for authentication..."
  vercel login || {
    echo "✗ Authentication failed"
    exit 1
  }
fi
echo ""

# Step 3: Deploy Backend
echo "════════════════════════════════════════════════════════════════"
echo "STEP 1: DEPLOYING BACKEND"
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Ready to deploy backend? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd /workspaces/base43/backend
  echo "Deploying backend..."
  vercel --prod || {
    echo "✗ Backend deployment failed"
    exit 1
  }
  
  # Extract backend URL
  BACKEND_URL=$(vercel ls --prod | grep "app-builder-backend" | awk '{print $2}' | head -1)
  if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Could not extract backend URL automatically"
    read -p "Enter backend URL (e.g., https://app-builder-backend-xxx.vercel.app): " BACKEND_URL
  fi
  
  echo ""
  echo "✓ Backend deployed!"
  echo "  URL: $BACKEND_URL"
  echo ""
else
  echo "Skipped backend deployment"
  read -p "Enter backend URL manually: " BACKEND_URL
fi

# Step 4: Deploy Frontend
echo "════════════════════════════════════════════════════════════════"
echo "STEP 2: DEPLOYING FRONTEND"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""
read -p "Ready to deploy frontend? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd /workspaces/base43/frontend
  
  echo "Setting REACT_APP_API_URL=$BACKEND_URL"
  export REACT_APP_API_URL="$BACKEND_URL"
  
  echo "Deploying frontend..."
  vercel --prod || {
    echo "✗ Frontend deployment failed"
    exit 1
  }
  
  echo ""
  echo "✓ Frontend deployed!"
else
  echo "Skipped frontend deployment"
  exit 0
fi

# Step 5: Set Environment Variables
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 3: CONFIGURE ENVIRONMENT VARIABLES"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  IMPORTANT: Set these in Vercel Dashboard!"
echo ""
echo "Backend Project - Settings → Environment Variables:"
echo "  • OPENAI_API_KEY = your-key"
echo "  • SUPABASE_URL = your-url"
echo "  • SUPABASE_KEY = your-key"
echo ""
echo "Frontend Project - Settings → Environment Variables:"
echo "  • REACT_APP_API_URL = $BACKEND_URL"
echo ""
echo "Then redeploy both projects."
echo ""

# Step 6: Verify
echo "════════════════════════════════════════════════════════════════"
echo "STEP 4: VERIFY DEPLOYMENT"
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Test health endpoint? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Testing: $BACKEND_URL/health"
  if curl -s "$BACKEND_URL/health" | grep -q "status"; then
    echo "✓ Backend health check passed!"
  else
    echo "✗ Backend health check failed"
    echo "  Make sure environment variables are set!"
  fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOYMENT COMPLETE!                                     ║"
echo "║                                                               ║"
echo "║  Frontend:  https://your-app-xxx.vercel.app                 ║"
echo "║  Backend:   $BACKEND_URL                    ║"
echo "║                                                               ║"
echo "║  Next: Set environment variables in Vercel Dashboard         ║"
echo "║        and redeploy!                                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
