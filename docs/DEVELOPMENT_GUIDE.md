# DEVELOPMENT_GUIDE.md

## Development Guide for base43

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/physicistcolloh-png/base43.git
cd base43
```

#### 2. Install Dependencies
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

#### 3. Configure Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### API Development

#### Available Endpoints

**Authentication:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user

**Builds:**
- `POST /api/builds/start` - Start new build
- `GET /api/builds/:sessionId/status` - Get build status
- `POST /api/builds/:sessionId/cancel` - Cancel build

**Integrations:**
- `GET /api/integrations` - List integrations
- `POST /api/integrations/:id/activate` - Activate integration

**Code Generation:**
- `POST /api/generate/code` - Generate code

### Frontend Development

#### Component Structure
```
src/
├── AppBuilder.jsx       # Main builder component
├── AppBuilder.css       # Styling
├── App.jsx             # Root wrapper
└── index.jsx           # Entry point
```

#### Key Components
1. **Login/Register** - Authentication screen
2. **Chat Panel** - Message interface
3. **Builder** - Build session management
4. **Preview Panel** - Live preview
5. **Pricing View** - Upgrade options

#### Styling
- CSS Modules in `AppBuilder.css`
- Responsive design (mobile-first)
- Gradient purple theme

### Backend Development

#### Project Structure
```
backend/
├── lib/
│   ├── buildSessionManager.js   # Session state
│   ├── codeGenerator.js         # Code generation
│   ├── integrationHandler.js    # Integration logic
│   ├── userManager.js           # User management
│   └── integrations.js          # Integration catalog
├── server.js                    # Express server
└── package.json
```

#### Key Managers

**BuildSessionManager**
- Create sessions
- Check locks
- Track progress
- Get session status

**CodeGenerator**
- Generate React components
- Generate Express backend
- Generate Docker files
- Generate environment files

**UserManager**
- Create/upgrade users
- Check tier limits
- Validate access
- Increment counters

**IntegrationHandler**
- Validate API keys
- Hash sensitive data
- Test connections
- Generate integration code

### Adding New Integrations

1. Add to `lib/integrations.js`:
```javascript
myIntegration: {
  id: 'my_integration',
  name: 'My Integration',
  category: 'other',
  description: 'Description',
  requiresApiKey: true,
  requiresTier: 'starter',
  pricing: 'Free tier + paid'
}
```

2. Add to `IntegrationHandler`:
```javascript
generateMyIntegrationCode() {
  return `
    // Your integration code
  `;
}
```

3. Add tier check in `server.js`:
```javascript
if (user.tier !== 'professional' && integrationId === 'my_integration') {
  return res.status(403).json({ error: 'Upgrade required' });
}
```

### Testing

#### Manual Testing Flow
1. Register new account
2. Start a build session
3. Monitor progress messages
4. Test integration selection
5. Verify code generation
6. Check preview rendering

#### Test Cases
- [x] Free user can start build
- [x] Free user sees 2 interaction limit
- [x] Free user sees upgrade prompt
- [x] Integration API key validation
- [x] Build locks prevent concurrent builds
- [x] Build can be cancelled
- [x] Code generation works
- [x] Preview renders HTML

### Debugging

#### Enable Verbose Logging
Backend (server.js):
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

#### Check Build Session
```bash
curl http://localhost:5000/api/builds/{sessionId}/status
```

#### Monitor Rate Limiting
```bash
# Make multiple requests to see limit headers
for i in {1..101}; do 
  curl http://localhost:5000/health
done
```

### Deployment

#### Docker Compose (Local)
```bash
docker-compose up --build
```

#### Docker Individual
```bash
# Backend
docker build -t base43-backend ./backend
docker run -p 5000:5000 base43-backend

# Frontend
docker build -t base43-frontend ./frontend
docker run -p 3000:3000 base43-frontend
```

#### Production Checklist
- [ ] Set JWT_SECRET securely
- [ ] Use PostgreSQL (not in-memory storage)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up CDN for frontend
- [ ] Configure custom domain
- [ ] Set up monitoring/logging
- [ ] Configure backups
- [ ] Load testing done

### Troubleshooting

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 {PID}
```

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
Check `FRONTEND_URL` in backend `.env`

**Build locks stuck:**
Restart backend - locks are in-memory

### Performance Optimization

**Frontend:**
- Code splitting for components
- Lazy load integrations
- Memoize chat messages
- Virtualize long lists

**Backend:**
- Cache integrations list
- Connection pooling for DB
- Redis for session store (production)
- Async/await for non-blocking I/O

### Security Checklist

- [ ] Validate all user inputs
- [ ] Hash API keys before storage
- [ ] Use JWT with expiry
- [ ] Rate limit all endpoints
- [ ] HTTPS in production
- [ ] Sanitize code output
- [ ] Validate API key format
- [ ] Log security events

### Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "Add feature: name"`
5. Push: `git push origin feature/name`
6. Create pull request

### Support & Issues

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@base43.dev
- Docs: docs.base43.dev

---

Happy developing! 🚀
