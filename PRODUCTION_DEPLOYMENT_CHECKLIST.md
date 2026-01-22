# ✅ Production Deployment Checklist

Complete checklist before deploying to production.

---

## 📋 Pre-Deployment Review (Days Before)

### Code Quality
- [ ] All tests pass: `cd backend && npm test` (if test script exists)
- [ ] No console.log statements in production code
- [ ] No hardcoded URLs or secrets in code
- [ ] No commented-out code
- [ ] Error handling implemented
- [ ] Logging configured appropriately
- [ ] No security vulnerabilities: `npm audit`

### Security
- [ ] No API keys in source code
- [ ] No passwords in version control
- [ ] CORS properly configured (specific domains only)
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] No SQL injection vulnerabilities
- [ ] HTTPS enforced
- [ ] Security headers configured

### Backend Configuration
- [ ] PORT environment variable used (not hardcoded)
- [ ] NODE_ENV set to production
- [ ] OPENAI_API_KEY configured
- [ ] SUPABASE_URL configured
- [ ] SUPABASE_KEY configured
- [ ] Error logging configured
- [ ] Database migrations tested
- [ ] API responses don't leak sensitive info

### Frontend Configuration
- [ ] REACT_APP_API_URL points to correct backend
- [ ] No console.log or debug code
- [ ] Build command works: `npm run build`
- [ ] Bundle size acceptable
- [ ] Images optimized
- [ ] CSS optimized
- [ ] No console errors in production build
- [ ] Favicon configured

### Documentation
- [ ] README.md up to date
- [ ] API documentation complete
- [ ] Setup instructions accurate
- [ ] Deployment guide written
- [ ] Troubleshooting guide created
- [ ] Environment variables documented

---

## 🔧 Technical Pre-Deployment (Day Before)

### Dependencies
- [ ] All dependencies specified in package.json
- [ ] No npm warnings on install: `npm ci`
- [ ] Lock file committed (package-lock.json)
- [ ] All devDependencies properly marked
- [ ] No duplicate dependencies

### Database
- [ ] Schema finalized
- [ ] Migrations tested
- [ ] Backup strategy in place
- [ ] Connection pooling configured (if applicable)
- [ ] Credentials secure

### Environment Setup
- [ ] Production .env configured
- [ ] All required vars listed
- [ ] No sample/test values in production
- [ ] Secrets manager configured (Vercel, AWS Secrets, etc.)

### Monitoring & Logging
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Application monitoring set up
- [ ] Log aggregation configured
- [ ] Alerts configured for errors
- [ ] Health check endpoint working

### Performance
- [ ] Frontend build optimized (`npm run build`)
- [ ] Backend response times acceptable (< 1s)
- [ ] Database queries optimized
- [ ] Caching configured (if needed)
- [ ] CDN configured (if needed)

---

## 🚀 Deployment Day Checklist

### Morning Review (3 hours before)
- [ ] Latest code merged to main branch
- [ ] All branches up to date with main
- [ ] No uncommitted changes: `git status`
- [ ] No untracked files that should be committed
- [ ] Git log looks good: `git log --oneline -5`

### Pre-Deployment Test (2 hours before)

**Local Testing:**
```bash
# Backend
cd backend
npm ci
npm start
# Health check: curl http://localhost:5000/health ✅

# Frontend (new terminal)
cd frontend
npm ci
REACT_APP_API_URL=http://localhost:5000 npm start
# App loads at http://localhost:3000 ✅
```

- [ ] Backend starts without errors
- [ ] Frontend compiles without warnings
- [ ] Health endpoints respond
- [ ] Frontend ↔ Backend communication works
- [ ] No console errors/warnings
- [ ] All major features tested

### Environment Variables (1 hour before)

**Backend Environment Variables:**
- [ ] OPENAI_API_KEY = valid key
- [ ] SUPABASE_URL = valid URL
- [ ] SUPABASE_KEY = valid key
- [ ] NODE_ENV = production
- [ ] PORT = 5000 (or appropriate port)

**Frontend Environment Variables:**
- [ ] REACT_APP_API_URL = production backend URL
- [ ] NODE_ENV = production

```bash
# Verify in Vercel dashboard
vercel env ls
```

### Database Readiness
- [ ] Database backup created
- [ ] Connection string correct
- [ ] Credentials secure
- [ ] Tables/collections exist
- [ ] Indexes created

### Deployment Configuration
- [ ] vercel.json configured correctly
- [ ] Build scripts in package.json correct
- [ ] No build warnings
- [ ] Dependencies will install cleanly

---

## 📤 Deployment Execution

### Deploy Backend (30 mins before frontend)

```bash
cd backend

# Verify everything
npm ci
npm test (if tests exist)

# Deploy
vercel --prod

# Verify
curl https://your-backend-url.vercel.app/health
```

Checklist:
- [ ] Deploy command executed successfully
- [ ] No build errors
- [ ] No runtime errors
- [ ] Health check responds (200 OK)
- [ ] API endpoints accessible
- [ ] Database connected
- [ ] APIs responding correctly

**Note: Copy the backend URL for next step**

### Configure Frontend with Backend URL

```bash
# Set frontend API URL to the backend URL from above
echo "REACT_APP_API_URL=https://your-backend-url.vercel.app" > frontend/.env.production

# Verify
vercel env add REACT_APP_API_URL
vercel env ls
```

### Deploy Frontend

```bash
cd frontend

# Verify build
npm ci
npm run build

# Deploy
vercel --prod

# Verify
# Open https://your-frontend-url.vercel.app in browser ✅
```

Checklist:
- [ ] Deploy command executed successfully
- [ ] No build errors
- [ ] No build warnings
- [ ] App loads without errors
- [ ] Can reach backend APIs
- [ ] All pages work
- [ ] Chat functionality works (if API keys configured)

---

## ✅ Post-Deployment Verification

### Immediate (First 5 minutes)

```bash
# Test health endpoints
curl https://your-backend-url.vercel.app/health
curl https://your-frontend-url.vercel.app/health (if endpoint exists)

# Test API endpoints
curl -X GET https://your-backend-url.vercel.app/api/pricing
curl -X POST https://your-backend-url.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

Checklist:
- [ ] Backend health: ✅ 200 OK
- [ ] Frontend loads: ✅ HTML page
- [ ] No CORS errors in browser console
- [ ] API endpoints respond
- [ ] Database connected
- [ ] Logs look normal

### First Hour Monitoring

- [ ] Check Vercel dashboard → Logs
- [ ] Monitor error rate
- [ ] Check browser console for errors
- [ ] Test chat feature (if API key set)
- [ ] Check API response times
- [ ] Monitor CPU/memory usage
- [ ] No unusual error patterns

### First 24 Hours

- [ ] Continue monitoring logs
- [ ] Check error tracking (Sentry, etc.)
- [ ] Monitor analytics
- [ ] Get team feedback
- [ ] Test edge cases
- [ ] Verify backups created
- [ ] Check uptime status

---

## 🆘 Rollback Procedures

### Quick Rollback (if needed in first hour)

**Option 1: Vercel Dashboard**
1. Go to Vercel dashboard
2. Select project
3. Go to Deployments tab
4. Find previous stable version
5. Click "Promote to Production"

**Option 2: Git Rollback**
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys automatically
```

**Option 3: Force Redeploy Previous**
```bash
vercel rollback
```

---

## 📞 Post-Deployment Support

### First Week
- [ ] Daily monitoring
- [ ] Team available for issues
- [ ] Document any bugs found
- [ ] Plan any fixes needed
- [ ] Monitor user feedback

### First Month
- [ ] Weekly review of analytics
- [ ] Check error logs
- [ ] Performance monitoring
- [ ] Database growth
- [ ] API usage patterns

### Ongoing
- [ ] Monthly security reviews
- [ ] Monthly performance reviews
- [ ] Quarterly dependency updates
- [ ] Annual penetration testing

---

## 📋 Final Sign-Off

Deploy Approval:
- [ ] Technical lead approved
- [ ] Code review completed
- [ ] Security review completed
- [ ] QA testing passed
- [ ] All checklist items completed

Deployment Team:
- [ ] Person deploying: _______________
- [ ] Observer/backup: _______________
- [ ] Time of deployment: _______________
- [ ] Expected duration: 30-45 minutes

### Deployment Log
- Start time: _______________
- Backend deployed: _______________
- Frontend deployed: _______________
- Verification completed: _______________
- Go-live time: _______________
- Any issues: _______________

### Success Confirmation
- [ ] All systems operational
- [ ] Users can access application
- [ ] Critical features working
- [ ] No error spikes
- [ ] Database responding normally
- [ ] Ready to announce

---

## 🎉 Post-Deployment Celebration

✅ Production deployment successful!

- Notify team
- Update status page
- Announce to users
- Document lessons learned
- Schedule team debrief

---

## 📊 Deployment Metrics

Expected metrics after deployment:

| Metric | Target | Actual |
|--------|--------|--------|
| Uptime | 99.9% | ___ |
| API Response Time | < 1s | ___ |
| Frontend Load Time | < 3s | ___ |
| Error Rate | < 0.1% | ___ |
| TTFB | < 500ms | ___ |
| Page Load Time | < 2s | ___ |

---

## 📚 Related Documents

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Detailed deployment steps
- [CODESPACES_SETUP.md](CODESPACES_SETUP.md) - Local/Codespaces setup
- [FRONTEND_BACKEND_FIX.md](FRONTEND_BACKEND_FIX.md) - Technical architecture
- [README.md](README.md) - Project overview

---

**Deployment Date:** _______________
**Status:** [ ] Not Deployed [ ] In Progress [ ] Complete ✅
