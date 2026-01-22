# 🚀 DEPLOY NOW - Complete Instructions

**Your app is ready to deploy to Vercel in just 3 steps!**

---

## ⚡ Quick Deploy (15 minutes)

### Option 1: Automated Deployment Script (Easiest)

```bash
# Run the automated deployment helper
./deploy.sh
```

This will guide you through everything step-by-step!

---

### Option 2: Manual Deployment

#### Step 1: Authenticate with Vercel

```bash
vercel login
```

This opens your browser. Sign in with GitHub/Google/email.

#### Step 2: Deploy Backend

```bash
cd backend
vercel --prod
```

**Save the URL it shows** (e.g., `https://app-builder-backend-xxx.vercel.app`)

#### Step 3: Deploy Frontend

```bash
cd ../frontend
export REACT_APP_API_URL="https://app-builder-backend-xxx.vercel.app"  # Replace xxx
vercel --prod
```

---

## 🔧 Set Environment Variables (Critical!)

After deployment, you MUST set these in Vercel Dashboard:

### For Backend Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your backend project
3. Settings → Environment Variables
4. Add these three:
   ```
   OPENAI_API_KEY = sk-proj-xxxxx...
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_KEY = eyJxxxxx...
   ```
5. Click "Redeploy" at the top

### For Frontend Project
1. Click your frontend project
2. Settings → Environment Variables
3. Add:
   ```
   REACT_APP_API_URL = https://your-backend-url.vercel.app
   ```
4. Click "Redeploy" at the top

---

## ✅ Verify It Works

```bash
# Test backend health
curl https://your-backend-url.vercel.app/health

# Should respond with:
# {"status":"ok","timestamp":"...","uptime":...}
```

Then open your frontend URL in browser and test sending a message.

---

## 🆘 Troubleshooting

### "No credentials found"
Run: `vercel login`

### "Build failed"
Check dependencies:
```bash
cd backend && npm ci
cd ../frontend && npm ci
```

### "Frontend can't reach backend"
Make sure `REACT_APP_API_URL` matches your actual backend URL in Vercel env vars

### "Health endpoint returns 503"
API keys not set in Vercel. Add them now!

---

## 📊 What Gets Deployed

| Component | Platform | URL |
|-----------|----------|-----|
| **Backend (Node.js)** | Vercel Serverless | `https://your-backend-xxx.vercel.app` |
| **Frontend (React)** | Vercel CDN | `https://your-frontend-xxx.vercel.app` |

---

## 🎯 Expected Results

After deployment and env var setup:
- ✅ Both URLs accessible
- ✅ Frontend loads without errors
- ✅ Backend health check returns 200
- ✅ Chat feature works (if API keys set)
- ✅ All features working globally

---

## 📞 Ready?

**Choose one:**

**Easy:** `./deploy.sh` (automated guide)
**Manual:** Follow "Option 2" steps above

**Estimated time:** 15-20 minutes

---

**Status:** ✅ READY TO DEPLOY

You've got everything you need. Let's go live! 🚀
