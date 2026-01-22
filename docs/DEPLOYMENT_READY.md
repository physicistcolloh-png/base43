# base43 - AI-Powered App Builder Platform
## Ready for Deployment

A full-stack AI app builder platform with OpenAI integration, Supabase backend, and multi-tier pricing.

### ✨ Features
- ✅ Chat-based AI app builder
- ✅ OpenAI GPT-4 integration  
- ✅ Supabase database support
- ✅ Multi-tier pricing (Free/Starter/Professional/Enterprise)
- ✅ Build session management with locks
- ✅ 19+ integrations
- ✅ Code generation
- ✅ Rate limiting & security
- ✅ Production-ready deployment configs

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- OpenAI API Key
- Supabase account

#### 1. Get API Keys

**OpenAI:**
- Go to https://platform.openai.com/api-keys
- Create API key (starts with `sk-`)

**Supabase:**
- Create account at https://supabase.com
- Create project
- Copy Project URL and anon key from Settings → API

#### 2. Setup Environment

```bash
# Copy example config
cp .env.example .env

# Edit with your keys
nano .env
```

Add:
```
OPENAI_API_KEY=sk-your_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
```

#### 3. Run Locally

**Option A: Docker**
```bash
docker-compose up
```

**Option B: Manual**
```bash
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm start
```

Access: http://localhost:3000

### 📦 Project Structure

```
base43/
├── backend/                 # Express API server
│   ├── server.js           # Main server with all endpoints
│   ├── lib/                # Helper modules
│   │   ├── buildSessionManager.js
│   │   ├── codeGenerator.js
│   │   ├── integrationHandler.js
│   │   └── userManager.js
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React UI
│   ├── src/
│   │   ├── AppBuilder.jsx  # Main component
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── shared/
│   └── types.ts           # TypeScript types
├── .env.example           # Environment template
├── docker-compose.yml     # Dev compose
├── docker-compose.prod.yml # Production compose
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

### 🔌 API Endpoints

#### Authentication (Optional)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

#### Chat
- `POST /api/chat` - Send message to AI

**Example:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a todo app",
    "conversationHistory": []
  }'
```

#### Builds
- `POST /api/builds/start` - Start new build
- `GET /api/builds/:sessionId` - Get build status
- `POST /api/generate/code` - Generate code

#### Integrations
- `GET /api/integrations` - List integrations
- `POST /api/integrations/:sessionId/:id` - Activate integration

#### Pricing
- `GET /api/pricing` - Get pricing tiers

#### Health
- `GET /health` - Health check

### 🚀 Deployment

#### Railway (Easiest)
1. Push to GitHub
2. Connect repo to Railway
3. Add env vars in dashboard
4. Done! Auto-deploys on push

#### Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set OPENAI_API_KEY=sk-... -a your-app-name
git push heroku main
```

#### Docker (Any VPS)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Self-Hosted
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide

### 📊 Database Setup

Using Supabase, create tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  tier TEXT DEFAULT 'free',
  build_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE build_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  app_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🔒 Security

- [ ] Set strong `JWT_SECRET` (min 32 chars)
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your domain
- [ ] Rate limiting enabled (100 req/15min)
- [ ] Regular dependency updates: `npm audit fix`
- [ ] Backup Supabase regularly

### 📈 Scaling

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start backend/server.js
pm2 start "cd frontend && npm start"
pm2 save
pm2 startup
```

### 🐛 Troubleshooting

**OpenAI Error:**
- Check API key is valid
- Verify billing enabled
- Check rate limits

**Supabase Connection Failed:**
- Verify URL and keys
- Check firewall
- Test: `curl https://your-project.supabase.co`

**Port Already in Use:**
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
```

### 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [QUICK_START.txt](QUICK_START.txt) - Quick setup reference
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Development guide
- [PLATFORM_OVERVIEW.md](PLATFORM_OVERVIEW.md) - Architecture overview

### 💡 Environment Variables

Required:
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars)

Optional:
- `SUPABASE_URL` - For database
- `SUPABASE_ANON_KEY` - For database
- `NODE_ENV` - 'development' or 'production'
- `PORT` - Backend port (default 5000)

### 📄 License

MIT

### 🤝 Support

For issues, check:
- OpenAI API Docs: https://platform.openai.com/docs
- Supabase Docs: https://supabase.com/docs
- Express Docs: https://expressjs.com

---

**Ready to deploy!** Start with `.env` setup, then choose your deployment platform.
