# Production Deployment Guide - Vercel

Complete guide for deploying the AI App Builder to Vercel for production.

---

## 📋 Prerequisites

✅ Vercel CLI installed (`npm install -g vercel@latest`)
✅ Vercel account (free at [vercel.com](https://vercel.com))
✅ GitHub repository pushed
✅ All API keys configured (.env ready)
✅ Both frontend and backend tested locally

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Code for Production

```bash
# Kill any running servers
pkill -f "npm start"

# Clean up and rebuild
cd /workspaces/base43
rm -rf frontend/build backend/node_modules
npm ci --prefix backend
npm ci --prefix frontend
npm run build --prefix frontend
```

### Step 2: Configure Environment Variables

Create `.env.production`:

```env
# Node environment
NODE_ENV=production
PORT=5000

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx...

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxx...

# Frontend API URL (will be set automatically by Vercel)
REACT_APP_API_URL=https://your-api-domain.vercel.app
```

### Step 3: Initialize Vercel Project

```bash
cd /workspaces/base43

# Login to Vercel
vercel login

# Initialize project
vercel init

# This will create .vercel/ directory and ask for project configuration
```

### Step 4: Set Up Backend Deployment

```bash
# Deploy backend first
cd backend
vercel env add OPENAI_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add FRONTEND_URL

# Deploy to production
vercel --prod
```

**Note the backend URL provided (e.g., `https://app-builder-backend.vercel.app`)**

### Step 5: Configure Frontend with Backend URL

```bash
cd ../frontend

# Update .env with backend URL from step 4
echo "REACT_APP_API_URL=https://app-builder-backend.vercel.app" >> .env.production

# Deploy frontend
vercel env add REACT_APP_API_URL
vercel --prod
```

### Step 6: Verify Deployment

Test your production URLs:

```bash
# Test backend health
curl https://your-backend-url.vercel.app/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}

# Test API endpoint
curl -X POST https://your-backend-url.vercel.app/api/pricing

# Frontend should be at
# https://your-frontend-url.vercel.app
```

---

## 🔧 Vercel Configuration

### vercel.json (Root)
- Project name: `ai-app-builder`
- Describes both frontend and backend
- Lists all required environment variables

### backend/vercel.json
- Build configuration for Node.js
- Routes all requests to server.js
- Environment variables: PORT, OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY

### frontend/vercel.json
- Build command: `npm run build`
- Dev command: `npm start`
- Install command: `npm ci`

---

## 🔐 Environment Variables

Set these in Vercel dashboard for each project:

### Backend (.env)
```
PORT=5000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-xxxxx...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxx...
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
NODE_ENV=production
```

---

## 📊 Vercel Console Monitoring

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your projects
3. View:
   - **Deployments** - View all deployment history
   - **Logs** - Real-time logs from production
   - **Analytics** - Performance metrics
   - **Settings** - Environment variables, domains, etc.

---

## 🌍 Custom Domain Setup

### For Backend

1. In Vercel dashboard → Backend project → Settings → Domains
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

### For Frontend

1. In Vercel dashboard → Frontend project → Settings → Domains
2. Add your custom domain (e.g., `www.yourdomain.com`)
3. Update DNS records as instructed
4. Update `REACT_APP_API_URL` environment variable

---

## 🔄 Continuous Deployment

### Automatic Deployment
- Every push to `main` branch → Auto-deploy to Vercel
- Set up in Project Settings → Git

### Preview Deployments
- Every pull request → Auto-preview URL
- Share preview with team before merging

### Rollback
- Vercel dashboard → Deployments → Select previous version → Promote to Production

---

## 📈 Performance Optimization

### Frontend Optimizations (Already Configured)
- ✅ React code splitting
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Build optimization

### Backend Optimizations
```javascript
// Compression middleware (add to server.js if needed)
const compression = require('compression');
app.use(compression());

// Rate limiting (already configured)
// Caching headers (add if needed)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache');
  }
  next();
});
```

---

## 🐛 Troubleshooting

### Frontend Can't Reach Backend
**Problem:** API calls fail with CORS error
**Solution:**
1. Verify `REACT_APP_API_URL` matches your backend URL
2. Check backend CORS configuration allows frontend domain
3. Verify both services are deployed and running

```bash
curl -v https://your-backend-url/health
```

### Build Fails on Vercel
**Problem:** Deployment fails during build
**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are listed in package.json
3. Ensure environment variables are set

```bash
# Test build locally first
npm run build --prefix frontend
npm run build --prefix backend
```

### Environment Variables Not Loaded
**Problem:** API key not recognized in production
**Solution:**
1. Verify variables are set in Vercel dashboard
2. Redeploy after adding/changing variables
3. Check variable names match exactly (case-sensitive)

```bash
# Check available env vars in Vercel
vercel env ls
```

### Logs Not Appearing
**Problem:** Can't see production logs
**Solution:**
1. Go to Vercel dashboard → Project → Logs
2. Filter by timeframe
3. Check both stdout and stderr tabs

---

## 🚀 Performance Monitoring

### Vercel Analytics
- Page load times
- Core Web Vitals
- Error rates
- Requests per minute

### Manual Testing

```bash
# Test API response time
time curl https://your-backend-url/api/pricing

# Test with more requests
for i in {1..10}; do
  curl https://your-backend-url/health
done
```

---

## 🔐 Security Checklist

✅ Environment variables not in code
✅ Sensitive keys in Vercel dashboard only
✅ CORS properly configured
✅ Rate limiting enabled
✅ HTTPS enforced (automatic with Vercel)
✅ API keys rotated regularly
✅ No debugging info in production logs

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] API keys configured
- [ ] Frontend/backend communicate
- [ ] Environment variables correct
- [ ] Build completes without errors
- [ ] No sensitive data in code
- [ ] vercel.json files configured
- [ ] Custom domain set up (optional)
- [ ] Monitoring alerts configured
- [ ] Backup/rollback plan ready
- [ ] Team notified of deployment
- [ ] Health endpoints responding

---

## 📞 Post-Deployment

### Monitor First 24 Hours
- Check Vercel logs regularly
- Monitor error rates
- Test core functionality
- Monitor API response times

### Set Up Alerts
1. Vercel dashboard → Settings → Alerts
2. Configure:
   - High error rate threshold
   - Build failures
   - Unusual traffic patterns
   - Performance degradation

### Weekly Monitoring
- Review analytics
- Check error logs
- Monitor database usage
- Verify backups

---

## 🔄 Rollback Procedure

If something goes wrong:

1. **Immediate Rollback (< 1 min)**
   - Vercel dashboard → Deployments
   - Click on previous stable version
   - Click "Promote to Production"

2. **Manual Rollback (few minutes)**
   ```bash
   git revert HEAD
   git push origin main
   # Vercel auto-deploys the reverted version
   ```

3. **Emergency Hotfix**
   - Create emergency branch
   - Fix issue
   - Deploy to staging first for testing
   - Merge to main

---

## 💰 Cost Optimization

### Free Tier Includes
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Free domain (.vercel.app)
- ✅ Up to 100GB bandwidth/month
- ✅ Up to 160GB data transfer/month

### Upgrade When Needed
- Pro tier: $20/month
- Enterprise: Custom pricing
- Automatic billing as you scale

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js Deployment on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/nodejs)
- [React Deployment on Vercel](https://vercel.com/guides/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Deployment Status

After successful deployment:

```
Frontend: https://your-frontend.vercel.app ✅
Backend:  https://your-backend.vercel.app ✅
Custom Domain: https://yourdomain.com (optional) ✅
Monitoring: Enabled ✅
Auto-deploys: Enabled ✅
```

---

**Ready for Production!** 🎉

Your AI App Builder is now deployed to Vercel with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 99.9% uptime SLA
- ✅ Auto-scaling
- ✅ Continuous deployment
- ✅ Easy rollbacks
