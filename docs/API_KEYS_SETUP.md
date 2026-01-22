# Quick Setup: Getting Your API Keys

## 🔑 OpenAI API Key (5 minutes)

### Step 1: Create OpenAI Account
1. Go to https://platform.openai.com
2. Sign up (or log in if you have an account)
3. Verify email

### Step 2: Get API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Save it somewhere safe - **you can't see it again!**

### Step 3: Add Billing
1. Go to https://platform.openai.com/account/billing/overview
2. Click "Set up paid account"
3. Add payment method (credit card)
4. Set usage limit if desired

### Step 4: Configure in base43

Edit `.env`:
```
OPENAI_API_KEY=sk-your_key_here
```

## 💾 Supabase (Optional - 10 minutes)

### Step 1: Create Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email/GitHub
4. Create new organization
5. Create new project

### Step 2: Get Connection Keys
1. Go to project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** (https://xxx.supabase.co)
   - **anon public** key
   - **service_role** secret (keep private!)

### Step 3: Configure in base43

Edit `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

## ✅ Verify Setup

### Test Backend
```bash
cd backend
npm start
# Should see: "Backend running on 5000"
```

### Test API
```bash
# Health check
curl http://localhost:5000/health

# Chat test (will use API key if configured)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Run Full App
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && PORT=3000 npm start

# Open browser
# http://localhost:3000
```

## 🚀 Ready to Deploy!

Choose your platform:
- **Railway** (Easiest) → https://railway.app
- **Heroku** → https://www.heroku.com
- **DigitalOcean** → https://digitalocean.com
- **Self-hosted** → See DEPLOYMENT.md

See DEPLOYMENT_CHECKLIST.md for full deployment steps.
