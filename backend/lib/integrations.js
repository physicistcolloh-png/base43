// Integration definitions with all required metadata
const INTEGRATIONS_DB = {
  // AI Models
  openai: {
    id: 'openai',
    name: 'OpenAI API',
    category: 'ai',
    description: 'GPT-4 & GPT-3.5 Turbo models',
    icon: '🤖',
    requiresApiKey: true,
    requiresTier: 'free',
    pricing: 'Usage-based',
    docs: 'https://platform.openai.com/docs',
    status: 'stable'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'ai',
    description: 'Google advanced AI model',
    icon: '🤖',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Usage-based',
    docs: 'https://ai.google.dev',
    status: 'stable'
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek AI',
    category: 'ai',
    description: 'DeepSeek LLM for reasoning tasks',
    icon: '🤖',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Usage-based',
    docs: 'https://api.deepseek.com',
    status: 'beta'
  },

  // Payment Systems
  stripe: {
    id: 'stripe',
    name: 'Stripe Payment Gateway',
    category: 'payment',
    description: 'Global payment processing',
    icon: '💳',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: '2.9% + $0.30',
    docs: 'https://stripe.com/docs',
    status: 'stable'
  },
  mpesa: {
    id: 'mpesa',
    name: 'M-Pesa Integration (STK Push)',
    category: 'payment',
    description: 'Mobile money for East Africa',
    icon: '💳',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Usage-based',
    docs: 'https://developer.safaricom.co.ke',
    status: 'stable'
  },
  pesapal: {
    id: 'pesapal',
    name: 'PesaPal Fallback',
    category: 'payment',
    description: 'Multi-channel payments',
    icon: '💳',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Percentage-based',
    docs: 'https://developer.pesapal.com',
    status: 'stable'
  },

  // Databases
  firebase: {
    id: 'firebase',
    name: 'Firebase',
    category: 'database',
    description: 'Realtime NoSQL database with auth',
    icon: '🔥',
    requiresApiKey: true,
    requiresTier: 'free',
    pricing: 'Free tier + pay-as-you-go',
    docs: 'https://firebase.google.com/docs',
    status: 'stable'
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    description: 'Open-source PostgreSQL backend',
    icon: '🔥',
    requiresApiKey: true,
    requiresTier: 'free',
    pricing: 'Free tier + pay-as-you-go',
    docs: 'https://supabase.com/docs',
    status: 'stable'
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    category: 'database',
    description: 'Cloud MongoDB database',
    icon: '🔥',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: 'Free tier + monthly plans',
    docs: 'https://docs.mongodb.com/atlas',
    status: 'stable'
  },
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Powerful relational database',
    icon: '🔥',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: 'Free (self-hosted) + managed',
    docs: 'https://www.postgresql.org/docs',
    status: 'stable'
  },
  airtable: {
    id: 'airtable',
    name: 'Airtable',
    category: 'database',
    description: 'Spreadsheet-like database',
    icon: '🔥',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Free tier + paid plans',
    docs: 'https://airtable.com/api',
    status: 'stable'
  },

  // Authentication
  auth0: {
    id: 'auth0',
    name: 'Auth0',
    category: 'auth',
    description: 'Enterprise authentication platform',
    icon: '🔐',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: 'Free tier + plans starting $13/month',
    docs: 'https://auth0.com/docs',
    status: 'stable'
  },
  jwt: {
    id: 'jwt',
    name: 'JWT Token System',
    category: 'auth',
    description: 'Self-hosted JWT authentication',
    icon: '🔐',
    requiresApiKey: false,
    requiresTier: 'free',
    pricing: 'Free',
    docs: 'https://jwt.io',
    status: 'stable'
  },

  // Communication
  twilio: {
    id: 'twilio',
    name: 'Twilio SMS',
    category: 'communication',
    description: 'SMS and voice messaging',
    icon: '📨',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: '$0.0075 per SMS',
    docs: 'https://www.twilio.com/docs',
    status: 'stable'
  },
  sendgrid: {
    id: 'sendgrid',
    name: 'SendGrid Email',
    category: 'communication',
    description: 'Email delivery service',
    icon: '📨',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Free tier + paid plans',
    docs: 'https://sendgrid.com/docs',
    status: 'stable'
  },
  websocket: {
    id: 'websocket',
    name: 'WebSocket Real-time',
    category: 'communication',
    description: 'Real-time bidirectional communication',
    icon: '📨',
    requiresApiKey: false,
    requiresTier: 'free',
    pricing: 'Free',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
    status: 'stable'
  },

  // Other
  google_apis: {
    id: 'google_apis',
    name: 'Google APIs',
    category: 'other',
    description: 'Google services (Maps, Sheets, Drive)',
    icon: '🔧',
    requiresApiKey: true,
    requiresTier: 'starter',
    pricing: 'Free tier + usage-based',
    docs: 'https://developers.google.com',
    status: 'stable'
  },
  rest_api: {
    id: 'rest_api',
    name: 'Custom REST APIs',
    category: 'other',
    description: 'Generic REST endpoint integration',
    icon: '🔧',
    requiresApiKey: false,
    requiresTier: 'free',
    pricing: 'Free',
    docs: 'https://restfulapi.net',
    status: 'stable'
  },
  n8n: {
    id: 'n8n',
    name: 'n8n Workflow Automation',
    category: 'other',
    description: 'No-code workflow automation',
    icon: '🔧',
    requiresApiKey: true,
    requiresTier: 'professional',
    pricing: 'Free tier + cloud plans',
    docs: 'https://docs.n8n.io',
    status: 'stable'
  }
};

module.exports = {
  INTEGRATIONS_DB,
  getAllIntegrations: () => Object.values(INTEGRATIONS_DB),
  getIntegrationsByCategory: (category) => 
    Object.values(INTEGRATIONS_DB).filter(i => i.category === category),
  getIntegrationById: (id) => INTEGRATIONS_DB[id],
  getIntegrationsByTier: (tier) => {
    const tierLevels = { free: 0, starter: 1, professional: 2, enterprise: 3 };
    const tierLevel = tierLevels[tier] || 0;
    
    return Object.values(INTEGRATIONS_DB).filter(i => {
      const requiredLevel = tierLevels[i.requiresTier] || 0;
      return requiredLevel <= tierLevel;
    });
  }
};
