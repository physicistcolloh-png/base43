# 🚀 Quick Start - Codespaces & Local Development

## TL;DR - Get Running in 30 Seconds

### For GitHub Codespaces

```bash
# 1. Get Codespace name
echo $CODESPACE_NAME

# 2. Update .env (replace YOUR-CODESPACE-NAME)
# REACT_APP_API_URL=https://YOUR-CODESPACE-NAME-5000.app.github.dev

# 3. Run startup script
bash startup.sh

# 4. Open frontend URL when ready
# https://YOUR-CODESPACE-NAME-3000.app.github.dev
```

### For Local Development

```bash
# 1. Ensure .env has
# REACT_APP_API_URL=http://localhost:5000

# 2. Terminal 1 - Backend
cd backend && npm start

# 3. Terminal 2 - Frontend
cd frontend && npm start

# 4. Open browser
# http://localhost:3000
```

---

## What Was Fixed

| Issue | Before | After |
|-------|--------|-------|
| **Hardcoded localhost** | ❌ `http://localhost:5000` | ✅ Environment variable |
| **Codespaces broken** | ❌ Didn't work | ✅ Works perfectly |
| **CORS configuration** | ❌ Allows all | ✅ Smart domain matching |
| **Professional UI** | ❌ Basic colors | ✅ Modern gradients |
| **Health check** | ❌ No endpoint | ✅ `/health` available |

---

## Critical Files

```
.env                      # Your configuration (don't commit)
.env.example              # Template with instructions
startup.sh                # One-command startup
CODESPACES_SETUP.md       # Detailed Codespaces guide
FRONTEND_BACKEND_FIX.md   # Complete technical explanation
VALIDATION_CHECKLIST.md   # Full testing guide
```

---

## Environment Variable Reference

```env
# Frontend API endpoint (MOST IMPORTANT)
REACT_APP_API_URL=https://CODESPACE-NAME-5000.app.github.dev

# For local development
REACT_APP_API_URL=http://localhost:5000

# Backend port
PORT=5000

# OpenAI (required)
OPENAI_API_KEY=sk-proj-xxxxx...

# Supabase (required)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxx...
```

---

## Test It Works

### Backend Health Check
```bash
# Local
curl http://localhost:5000/health

# Codespaces
curl https://CODESPACE-NAME-5000.app.github.dev/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Frontend Check
1. Open app in browser
2. Send a test message
3. Check DevTools Network tab
4. Look at POST request URL
   - Should show your server URL, NOT localhost
   - Should have status 200
5. See AI response appear in chat

---

## Common Issues & Fixes

### "Cannot POST /api/chat"
✅ Check `REACT_APP_API_URL` in `.env`
✅ Restart frontend after changing `.env`
✅ Verify backend is running

### "CORS error" in browser
✅ Verify backend is accessible
✅ Check `REACT_APP_API_URL` is complete
✅ Include `https://` and `-5000` port suffix

### "localhost shows Codespaces page"
✅ This is normal! Use the full URL with codespace name
✅ Or use `startup.sh` which provides the correct URL

### Frontend blank screen
✅ Check browser console (F12) for errors
✅ Verify both servers are running
✅ Clear cache and do hard refresh (Ctrl+F5)

---

## File Changes Summary

### Backend (server.js)
✅ Enhanced CORS for Codespaces domains
✅ Added `/health` endpoint
✅ Support for multiple deployment platforms
✅ Better error messages

### Frontend (AppBuilder.jsx)
✅ Uses `REACT_APP_API_URL` environment variable
✅ No more hardcoded localhost
✅ Works in Codespaces, local, and production

### Configuration (.env.example)
✅ Clear examples for each environment
✅ Step-by-step instructions
✅ All supported platforms documented

---

## Architecture

```
Your Machine / Codespaces
│
├─ Frontend (React)
│  └─ Port 3000
│     └─ Uses REACT_APP_API_URL to call backend
│
├─ Backend (Express)
│  └─ Port 5000
│     ├─ /health - Status check
│     ├─ /api/chat - Chat endpoint
│     ├─ /api/apps - App management
│     └─ Calls OpenAI & Supabase
│
└─ External Services
   ├─ OpenAI (GPT-4)
   └─ Supabase (Database)
```

---

## Professional Features ✨

✅ **Codespaces-ready** - Works out of the box
✅ **Local-dev ready** - Full localhost support
✅ **Production-ready** - Scalable architecture
✅ **CORS smart** - Specific domain matching
✅ **Error handling** - Clear messages
✅ **Modern UI** - Professional styling
✅ **Health checks** - Monitoring ready
✅ **Rate limiting** - Protection included

---

## Next Steps

1. **Read Full Guide:** `CODESPACES_SETUP.md`
2. **Update .env** with your Codespace name
3. **Run startup script:** `bash startup.sh`
4. **Test in browser** at provided URL
5. **Check validation checklist:** `VALIDATION_CHECKLIST.md`
6. **Build AI apps!** 🎉

---

## Need Help?

1. **Setup issues?** → Read `CODESPACES_SETUP.md`
2. **Technical details?** → Read `FRONTEND_BACKEND_FIX.md`
3. **Verify working?** → Use `VALIDATION_CHECKLIST.md`
4. **Testing?** → See "Test It Works" section above

---

**Status:** ✅ Production Ready  
**Updated:** 2024  
**Platforms:** Codespaces ✅ Local ✅ Production ✅
