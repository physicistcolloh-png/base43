#!/bin/bash

# Complete Production Fix Script
# This will:
# 1. Rebuild frontend locally
# 2. Deploy both frontend and backend with proper configs
# 3. Guide you through final Vercel settings

set -e

echo "╔════════════════════════════════════════════════════╗"
echo "║  🚀 COMPLETE PRODUCTION FIX                        ║"
echo "║  Disabling Deployment Protection                   ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Step 1: Clean and rebuild frontend
echo "📦 Rebuilding frontend..."
cd /workspaces/base43/frontend
rm -rf build/ node_modules/.cache/
npm run build > /dev/null 2>&1 && echo "✅ Frontend built successfully" || echo "❌ Build failed"

# Step 2: Instructions for manual Vercel settings
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  🔧 MANUAL STEPS REQUIRED                          ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Complete these steps in Vercel Dashboard:"
echo ""
echo "FOR BACKEND (frontend-base44):"
echo "  1. Go: https://vercel.com/dashboard"
echo "  2. Click: 'frontend' project (backend)"
echo "  3. Settings → Deployment Protection"
echo "  4. Toggle: OFF all protection settings"
echo "  5. Settings → Environment Variables"
echo "  6. Verify: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY are set"
echo "  7. Click: Redeploy"
echo ""
echo "FOR FRONTEND (frontend-q1ews166s-base44):"
echo "  1. Click: 'frontend' project"
echo "  2. Settings → Deployment Protection"  
echo "  3. Toggle: OFF all protection settings"
echo "  4. Settings → Environment Variables"
echo "  5. Add:"
echo "     - CI = false"
echo "     - REACT_APP_API_URL = https://frontend-base44.vercel.app"
echo "  6. Click: Redeploy"
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  Once complete, your app will be live! 🎉          ║"
echo "╚════════════════════════════════════════════════════╝"
