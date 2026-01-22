# base43 - AI App Builder Platform

A multi-user, AI-powered app and website builder that works entirely inside a chat-based interface, behaving like an AI assistant building apps live with step-by-step clear progress and no confusion.

## 🎯 PLATFORM OVERVIEW

base43 is an innovative AI-powered app builder that brings the experience of an AI assistant into a chat interface. Users can describe what they want to build, and the platform generates production-ready frontend and backend code with integrated payment systems, databases, and authentication.

## ✨ CORE FEATURES

### 1. Chat-Based Build Interface
- Conversational build process (one conversation, one build)
- Real-time progress updates with streaming messages
- Step-by-step status updates
- No heavy IDE, just like chatting with an AI
- Async processing for instant feedback

### 2. Build Session Management
- **One build at a time per user** (no overlaps)
- Build locks to prevent concurrent builds
- Full session tracking with progress history
- Build cancellation support

### 3. Multi-Tier Pricing System

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| Price | Free | KES 1,500/mo | KES 2,400/mo | KES 3,500/mo |
| Annual Discount | - | 10% | 15% | 20% |
| Interactions | 2 | Unlimited | Unlimited | Unlimited |
| AI Models | OpenAI | Multiple | All | All |
| Integrations | Limited | Basic | All | All |
| Custom Domain | No | No | Yes | Yes |
| Watermark | Yes | No | No | No |
| Download Apps | No | No | Yes | Yes |

### 4. Integration Marketplace (19+ Total)

**🤖 AI Models (Free tier: OpenAI only)**
- OpenAI API - Free tier
- Google Gemini - Starter+
- DeepSeek AI - Starter+

**💳 Payment Systems**
- Stripe - Professional+
- M-Pesa (STK Push) - Starter+
- PesaPal - Starter+

**🔥 Databases**
- Firebase - Free tier
- Supabase - Free tier
- MongoDB Atlas - Professional+
- PostgreSQL - Professional+
- Airtable - Starter+

**🔐 Authentication**
- Auth0 - Professional+
- JWT Token System - Free tier

**📨 Communication**
- Twilio SMS - Professional+
- SendGrid Email - Starter+
- WebSocket Real-time - Free tier

**🔧 Other**
- Google APIs - Starter+
- Custom REST APIs - Free tier
- n8n Workflow Automation - Professional+

## 🚀 BUILD PROCESS (Mandatory Order)

1. ✅ Understanding Requirements
2. ✅ Initializing Project
3. ✅ Generating Frontend
4. ✅ Generating Backend
5. ✅ Showing Integrations
6. ✅ Applying Selected Integrations
7. ✅ Rendering Live Preview
8. ✅ Finalizing Build

## 🏗️ PROJECT STRUCTURE

```
base43/
├── backend/
│   ├── lib/
│   │   ├── buildSessionManager.js    # Build state & locks
│   │   ├── codeGenerator.js          # Code generation
│   │   ├── integrationHandler.js     # Integration management
│   │   ├── userManager.js            # Tier & limits
│   │   └── integrations.js           # 19+ integrations
│   ├── server.js                     # Express API
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── AppBuilder.jsx            # Chat builder interface
│   │   ├── AppBuilder.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── public/index.html
│   └── package.json
├── shared/
│   └── types.ts
└── README.md
```

## 📡 KEY API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login with email

### Build Sessions (Core)
- `POST /api/builds/start` - Start build (checks lock)
- `GET /api/builds/:sessionId/status` - Get progress
- `POST /api/builds/:sessionId/cancel` - Cancel build

### Code Generation
- `POST /api/generate/code` - Generate React + Express

### Integrations
- `GET /api/integrations?userId=X` - Available for tier
- `POST /api/integrations/:id/activate` - Activate (tier check)

### Pricing
- `GET /api/pricing` - Tier information
- `POST /api/upgrade` - Redirect to PesaPal

## 🔐 SECURITY IMPLEMENTATION

✅ API keys hashed with SHA-256
✅ Rate limiting: 100 requests/15 minutes
✅ JWT tokens with 24-hour expiry
✅ Build locks prevent concurrent builds
✅ Input validation with Zod
✅ Session validation on all endpoints

## 💰 PRICING & UPGRADE

All upgrades redirect to:
```
https://store.pesapal.com/base44bingwasokonidata
```

**Monthly Plans:**
- Free: Unlimited builds (2 interactions, watermark)
- Starter: KES 1,500/month (-10% annually)
- Professional: KES 2,400/month (-15% annually)
- Enterprise: KES 3,500/month (-20% annually)

## 🚀 GET STARTED

### Development

**Backend:**
```bash
cd backend
npm install
npm run dev  # http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm start   # http://localhost:3000
```

### Production (Docker)

```bash
docker build -t base43-backend ./backend
docker build -t base43-frontend ./frontend

docker run -p 5000:5000 base43-backend
docker run -p 3000:3000 base43-frontend
```

## 🎯 KEY FEATURES SUMMARY

| Feature | Status | Details |
|---------|--------|---------|
| Chat Interface | ✅ | React component with real-time messages |
| Build Locks | ✅ | Prevents concurrent builds per user |
| Live Preview | ✅ | Iframe with watermark system |
| 19+ Integrations | ✅ | Full tier-based access control |
| Tier System | ✅ | Free/Starter/Pro/Enterprise |
| Code Generation | ✅ | React + Express templates |
| Watermark System | ✅ | Free tier only, non-interactive |
| Progress Updates | ✅ | Chat messages for each step |

## 🎨 UI HIGHLIGHTS

- **Chat-Based**: Like messaging with an AI
- **Real-time Feedback**: Progress messages ("Building frontend...")
- **Integration Cards**: Visual grid with upgrade prompts
- **Live Preview**: Split-screen preview with code
- **Responsive Design**: Mobile, tablet, desktop
- **Smooth Animations**: Slide-in messages, hover effects

## 🔄 BUILD LOCK MECHANISM

Prevents overlapping builds:
- User starts build → Lock created
- Build in progress → New build blocked with message
- Build completes → Lock released
- Lock timeout: 24 hours (production)

Response when locked:
```json
{
  "error": "A build is already in progress. Please wait or cancel."
}
```

## 📊 TECHNOLOGY STACK

**Backend:**
- Node.js 18+
- Express.js
- JWT Authentication
- Rate Limiter
- UUID sessions

**Frontend:**
- React 18
- Axios
- CSS Modules
- Real-time UI

**Shared:**
- TypeScript types
- Zod validation

## 🎯 NEXT STEPS (Production Roadmap)

1. ✅ Core platform built
2. 🔲 Database integration (PostgreSQL)
3. 🔲 Real payment gateway setup
4. 🔲 Custom domain routing
5. 🔲 App hosting infrastructure
6. 🔲 Advanced AI code generation
7. 🔲 Analytics dashboard
8. 🔲 Team collaboration
9. 🔲 Git integration
10. 🔲 CI/CD automation

## 📝 INTEGRATION ACTIVATION FLOW

1. User selects integration
2. System checks tier access
3. Prompt for API key
4. Validate key format
5. Test connection
6. Hash & store key
7. Update session
8. Generate integration code
9. Return to builder

## 🌟 UNIQUE VALUE PROPOSITIONS

✨ **No Learning Curve** - Chat interface, not IDE
✨ **Instant Apps** - Production-ready in minutes
✨ **19+ Integrations** - Pre-built support
✨ **Affordable** - Starting at KES 1,500/month
✨ **No Lock-in** - Download your apps anytime
✨ **Live Preview** - See your app as you build

---

**Repository:** github.com/physicistcolloh-png/base43
**Author:** physicistcolloh-png
**Support:** support@base43.dev
**Upgrade Store:** store.pesapal.com/base44bingwasokonidata

Built with ❤️ for creators who want to build without boundaries.
