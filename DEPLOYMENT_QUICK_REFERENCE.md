# 🚀 Deployment Quick Reference

**TL;DR for deploying to Vercel in 15 minutes**

---

## Prerequisites

```bash
✅ Vercel CLI installed
✅ GitHub account
✅ Vercel account (free)
✅ OpenAI API key
✅ Supabase credentials
```

---

## 3-Step Deployment

### Step 1: Deploy Backend (5 min)

```bash
cd /workspaces/base43/backend
vercel --prod
# Copy the URL shown: https://your-api-xxx.vercel.app
```

### Step 2: Deploy Frontend (5 min)

```bash
cd /workspaces/base43/frontend

# Set API URL environment variable
export REACT_APP_API_URL="https://your-api-xxx.vercel.app"

# Deploy
vercel --prod
# Access at: https://your-app-xxx.vercel.app
```

### Step 3: Verify (5 min)

```bash
# Test backend
curl https://your-api-xxx.vercel.app/health
# Response: {"status":"ok",...}

# Open frontend
open https://your-app-xxx.vercel.app
# Should load and connect to backend
```

---

## Environment Variables (Set in Vercel)

### Backend
```
OPENAI_API_KEY=sk-proj-xxxxx...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxxx...
```

### Frontend
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Frontend can't reach backend | Check `REACT_APP_API_URL` in Vercel env |
| Build fails | Run `npm run build` locally to see error |
| 404 Not Found | Verify routes in `vercel.json` |
| CORS error | Backend CORS configured for `*.vercel.app` |

---

## Useful Commands

```bash
# Check deployment status
vercel status

# View logs
vercel logs

# Rollback to previous
vercel rollback

# Set environment variable
vercel env add VARIABLE_NAME

# List all deployments
vercel ls
```

---

## Dashboard Links

- **Vercel:** https://vercel.com/dashboard
- **Your Project:** https://vercel.com/dashboard/projects

---

## Success Criteria

- [x] Backend responds to `/health`
- [x] Frontend loads without errors
- [x] Frontend can call backend APIs
- [x] No CORS errors
- [x] Chat feature works (if API key set)

---

**Deployment Time: ~15 minutes**
**Status: Ready to deploy!** ✅
