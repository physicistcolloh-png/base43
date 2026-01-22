# 🚀 Vercel Deployment - Step by Step

## Step 1: Authenticate with Vercel (Required First)

```bash
vercel login
```

**This will:**
1. Open browser to Vercel login
2. You authenticate with GitHub/Google/email
3. CLI automatically connects to your account

---

## Step 2: Deploy Backend

```bash
cd backend
vercel --prod
```

**Follow the prompts:**
- ✓ Link to existing project? → Yes (or create new)
- ✓ Which scope? → Your personal account
- ✓ Link to existing? → No (first time)
- ✓ Project name? → app-builder-backend
- ✓ Directory? → ./ (current)

**Result:** You'll get a URL like `https://app-builder-backend-xxx.vercel.app`
**Save this URL!** You need it for frontend.

---

## Step 3: Deploy Frontend

```bash
cd ../frontend

# Set the backend URL you got from step 2
export REACT_APP_API_URL="https://app-builder-backend-xxx.vercel.app"

# Deploy
vercel --prod
```

**Follow the prompts:**
- ✓ Project name? → app-builder-frontend
- ✓ Build command? → npm run build
- ✓ Output directory? → build

**Result:** Frontend URL like `https://app-builder-frontend-xxx.vercel.app`

---

## Step 4: Verify Everything Works

```bash
# Test backend health
curl https://app-builder-backend-xxx.vercel.app/health

# Open frontend in browser
open https://app-builder-frontend-xxx.vercel.app
```

---

## Environment Variables Setup (Important!)

### In Vercel Dashboard - Backend Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your backend project
3. Settings → Environment Variables
4. Add:
   ```
   OPENAI_API_KEY = sk-proj-xxxxx...
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_KEY = eyJxxxxx...
   ```
5. Redeploy after adding variables

### In Vercel Dashboard - Frontend Project

1. Select your frontend project
2. Settings → Environment Variables
3. Add:
   ```
   REACT_APP_API_URL = https://your-backend-xxx.vercel.app
   ```
4. Redeploy after adding variables

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "No credentials found" | Run `vercel login` first |
| Build fails | Check npm dependencies with `npm ci` |
| CORS errors | Make sure backend API URL is correct |
| Blank frontend | Check `REACT_APP_API_URL` env var is set |

---

## Let's Deploy Now!

Ready? Start with:
```bash
vercel login
```

This will open your browser automatically. Authenticate and come back here.

Then follow the steps above. You've got this! 🎉
