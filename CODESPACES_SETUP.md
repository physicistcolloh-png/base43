# GitHub Codespaces Setup Guide

This guide helps you run the AI App Builder in GitHub Codespaces with proper frontend-backend communication.

## Problem with Localhost

When running in GitHub Codespaces, `localhost` URLs don't work because Codespaces uses **forwarded ports** with domain names like:
- Backend: `https://your-codespace-name-5000.app.github.dev`
- Frontend: `https://your-codespace-name-3000.app.github.dev`

## Solution: Environment Variables

The app is configured to use environment variables for the API URL, making it work in any environment.

## Step 1: Get Your Codespace Name

In the terminal, run:

```bash
echo $CODESPACE_NAME
```

You should see something like: `awesome-guacamole-wx5qx4j7p2f`

**Save this name - you'll need it in the next step.**

## Step 2: Update Your Environment Configuration

1. Open `.env` file in the workspace root
2. Find the line: `REACT_APP_API_URL=http://localhost:5000`
3. Replace it with your Codespace URL:

```env
REACT_APP_API_URL=https://YOUR-CODESPACE-NAME-5000.app.github.dev
```

**Example:**
```env
REACT_APP_API_URL=https://awesome-guacamole-wx5qx4j7p2f-5000.app.github.dev
```

## Step 3: Verify API Keys

Make sure your `.env` file has all required keys:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-proj-xxxxx...

# Supabase (required)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx...
```

## Step 4: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Server is running on port 5000
✅ OpenAI client initialized
✅ Supabase client initialized
```

**Test the backend:**
- Navigate to: `https://YOUR-CODESPACE-NAME-5000.app.github.dev/health`
- You should see: `{"status":"ok","timestamp":"...","uptime":...}`

## Step 5: Start the Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm install
REACT_APP_API_URL=https://YOUR-CODESPACE-NAME-5000.app.github.dev npm start
```

The frontend will start on port 3000 and automatically open in your browser.

**Note:** You can also set `REACT_APP_API_URL` in `.env` and just run `npm start`.

## Step 6: Access Your App

GitHub Codespaces will show a notification for port 3000. Click "Open in Browser" or navigate to:

```
https://YOUR-CODESPACE-NAME-3000.app.github.dev
```

The app should load and you can:
- ✅ Type messages in the chat
- ✅ Send messages to OpenAI
- ✅ Build apps with AI
- ✅ See responses from the API

## Troubleshooting

### Problem: "Cannot POST /api/chat" Error

**Solution:** 
- Verify `REACT_APP_API_URL` is correct (check step 2)
- Verify it uses `https://`, not `http://`
- Verify the `-5000` port suffix is included
- Check backend is running (you should see output in the backend terminal)

**Debug in Browser:**
1. Press `F12` to open DevTools
2. Go to "Network" tab
3. Try sending a message
4. Look at the request URL - it should show your Codespace URL, not localhost

### Problem: "CORS Error" in Browser

**Solution:** This means the backend isn't accepting requests from the frontend domain.
- Verify backend is running with correct configuration
- Check that `REACT_APP_API_URL` includes the full Codespace URL
- Try accessing the health endpoint directly to confirm backend is accessible

### Problem: Frontend Shows Blank Screen

**Solution:**
- Check browser console (F12) for errors
- Verify both servers are running
- Clear browser cache (Ctrl+Shift+Delete)
- Try a hard refresh (Ctrl+F5)
- Check that npm install completed successfully

### Problem: Port Forwarding Shows "Not Found"

**Solution:** 
- This is normal in Codespaces. The app should still be accessible via the full URL
- If you see a forwarding page, wait a moment for the app to load
- Use the full HTTPS URL provided by Codespaces

## Quick Reference

| Environment | API URL |
|---|---|
| Local Machine | `http://localhost:5000` |
| Codespaces | `https://CODESPACE-NAME-5000.app.github.dev` |
| Production | `https://api.yourdomain.com` |

## Switching Back to Local Development

If you want to work on your local machine again:

1. Update `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

2. Start backend:
```bash
cd backend && npm start
```

3. Start frontend in another terminal:
```bash
cd frontend && npm start
```

4. Open `http://localhost:3000` in your browser

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│     Your GitHub Codespace (cloud environment)      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐         ┌──────────────┐        │
│  │   Frontend   │         │   Backend    │        │
│  │  Port 3000   │◄───────►│  Port 5000   │        │
│  │   React      │  HTTPS  │   Express    │        │
│  └──────────────┘         └──────────────┘        │
│       ▲                           ▲                │
│       │                           │                │
│  Uses REACT_APP_API_URL    Uses OpenAI & Supabase │
│  to call backend                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
         ▲                            ▲
         │                            │
   Browser on your               External
   machine or Codespaces         APIs
```

## Environment Variables

### Frontend (.env for React)

```
# API endpoint - where frontend calls for data
REACT_APP_API_URL=https://YOUR-CODESPACE-NAME-5000.app.github.dev
```

### Backend (.env for Node.js)

```
# Listening port
PORT=5000

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxx...

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx...

# CORS - allows requests from frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=https://YOUR-CODESPACE-NAME-3000.app.github.dev
```

## Next Steps

1. ✅ Configure environment variables
2. ✅ Start backend server
3. ✅ Start frontend server
4. ✅ Test API connectivity
5. 📝 Build and test your AI apps!

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check browser console (F12) for detailed errors
4. Verify both servers are running and accessible
