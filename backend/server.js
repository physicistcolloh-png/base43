const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Supabase
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

// CORS Configuration for Codespaces and production
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from:
    // - localhost for local development
    // - *.app.github.dev for GitHub Codespaces
    // - *.herokuapp.com for Heroku
    // - *.railway.app for Railway
    // - *.vercel.app for Vercel deployments
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      /\.app\.github\.dev$/,
      /\.herokuapp\.com$/,
      /\.railway\.app$/,
      /\.vercel\.app$/,
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ];
    
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? origin === allowed : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

const users = new Map();
const buildSessions = new Map();
const activeBuildLocks = new Map();

// OPTIONS for preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// OPTIONS for preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// AUTH
app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ error: 'Missing fields' });
  
  const userId = uuidv4();
  const user = { id: userId, email, username, tier: 'free', createdAt: new Date(), buildCount: 0, interactionsUsed: 0 };
  users.set(userId, user);
  res.status(201).json({ message: 'Registered', user: { id: user.id, email: user.email, tier: user.tier } });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json({ token: 'demo_' + user.id, user: { id: user.id, email: user.email, tier: user.tier } });
});

// BUILDS
app.post('/api/builds/start', (req, res) => {
  const { userId, appName, description, requirements } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (activeBuildLocks.has(userId)) return res.status(409).json({ error: 'A build is already in progress. Please wait or cancel.' });
  
  const user = users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.tier === 'free' && user.interactionsUsed >= 2) return res.status(403).json({ error: 'Free tier limit (2 interactions)', upgradeLink: 'https://store.pesapal.com/base44bingwasokonidata' });
  
  const sessionId = uuidv4();
  const session = { id: sessionId, userId, status: 'initializing', appName, description, requirements, generatedCode: {}, selectedIntegrations: [], createdAt: new Date(), updatedAt: new Date() };
  
  activeBuildLocks.set(userId, sessionId);
  buildSessions.set(sessionId, session);
  user.interactionsUsed += 1;
  user.buildCount += 1;
  
  res.json({ message: 'Build started', sessionId, session, progressSteps: ['Understanding requirements', 'Initializing project', 'Generating frontend', 'Generating backend', 'Showing integrations', 'Rendering live preview', 'Finalizing build'] });
});

app.get('/api/builds/:sessionId/status', (req, res) => {
  const session = buildSessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Not found' });
  res.json(session);
});

app.post('/api/builds/:sessionId/cancel', (req, res) => {
  const { sessionId, userId } = req.body;
  const session = buildSessions.get(sessionId);
  if (!session || session.userId !== userId) return res.status(404).json({ error: 'Not found' });
  activeBuildLocks.delete(userId);
  buildSessions.delete(sessionId);
  res.json({ message: 'Cancelled' });
});

// INTEGRATIONS
const INTEGRATIONS = [
  { id: 'openai', name: 'OpenAI API', category: 'ai', description: 'GPT models', requiresTier: 'free' },
  { id: 'firebase', name: 'Firebase', category: 'database', description: 'Realtime DB', requiresTier: 'free' },
  { id: 'supabase', name: 'Supabase', category: 'database', description: 'PostgreSQL', requiresTier: 'free' },
  { id: 'stripe', name: 'Stripe', category: 'payment', description: 'Payments', requiresTier: 'professional' },
  { id: 'jwt', name: 'JWT Auth', category: 'auth', description: 'JWT auth', requiresTier: 'free' },
  { id: 'websocket', name: 'WebSocket', category: 'communication', description: 'Real-time', requiresTier: 'free' }
];

app.get('/api/integrations', (req, res) => {
  const user = users.get(req.query.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  const isFree = user.tier === 'free';
  res.json(INTEGRATIONS.map(i => ({ ...i, isDisabled: isFree && i.requiresTier !== 'free' })));
});

app.post('/api/integrations/:id/activate', (req, res) => {
  const { userId, sessionId } = req.body;
  const user = users.get(userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.tier === 'free') return res.status(403).json({ error: 'Free users cannot activate' });
  const session = buildSessions.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Not found' });
  const integration = INTEGRATIONS.find(i => i.id === req.params.id);
  if (!integration) return res.status(404).json({ error: 'Not found' });
  session.selectedIntegrations.push(integration);
  res.json({ message: integration.name + ' activated', integration });
});

// CODE
app.post('/api/generate/code', (req, res) => {
  const session = buildSessions.get(req.body.sessionId);
  if (!session) return res.status(404).json({ error: 'Not found' });
  const frontend = 'import React from "react";\nexport default () => <div><h1>' + session.appName + '</h1><p>' + session.description + '</p></div>;';
  const backend = 'const express=require("express");const app=express();app.post("/api/submit",(req,res)=>{res.json({success:true})});app.listen(3001);';
  session.generatedCode = { frontend, backend };
  res.json({ code: { frontend, backend } });
});

// AI CHAT
app.post('/api/chat', async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' });
    }

    const { message, conversationHistory = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const messages = [
      { role: 'system', content: 'You are an expert AI app builder assistant. Help users design, plan, and build applications. Provide code examples and architectural guidance.' },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1500
    });

    res.json({ 
      reply: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'Failed to generate response: ' + error.message });
  }
});

// PRICING
app.get('/api/pricing', (req, res) => {
  res.json({ tiers: [{ name: 'Free', price: 0 }, { name: 'Starter', price: 1500 }, { name: 'Professional', price: 2400 }, { name: 'Enterprise', price: 3500 }], upgradeLink: 'https://store.pesapal.com/base44bingwasokonidata' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Error' }); });

app.listen(PORT, () => console.log('Backend running on ' + PORT));
module.exports = app;
