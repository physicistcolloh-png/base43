// INTEGRATION_EXAMPLES.md

## Integration Examples & Activation Guide

This document shows examples of how each integration works once activated.

### 🤖 AI MODELS

#### OpenAI (Free Tier)
```javascript
// Activated integration code
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Google Gemini (Starter+)
```javascript
// Similar to OpenAI but with Google's Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.post('/api/ai/generate', async (req, res) => {
  const result = await model.generateContent(req.body.prompt);
  res.json({ content: result.response.text() });
});
```

---

### 💳 PAYMENT SYSTEMS

#### Stripe (Professional+)
```javascript
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100, // cents
      currency: 'usd',
      metadata: { userId: req.user.id }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/payments/confirm', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      req.body.paymentIntentId,
      { payment_method: req.body.paymentMethodId }
    );
    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### M-Pesa (Starter+)
```javascript
// M-Pesa STK Push integration
const axios = require('axios');

app.post('/api/mpesa/stk-push', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_CODE,
        Password: generatePassword(),
        Timestamp: new Date().toISOString().slice(0,14),
        TransactionType: 'CustomerPayBillOnline',
        Amount: req.body.amount,
        PartyA: req.body.phoneNumber,
        PartyB: process.env.MPESA_CODE,
        PhoneNumber: req.body.phoneNumber,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: req.body.orderId,
        TransactionDesc: 'Payment for your app'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_ACCESS_TOKEN}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

### 🔥 DATABASES

#### Firebase (Free Tier)
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY))
});

const db = admin.firestore();

// Create
app.post('/api/items', async (req, res) => {
  const doc = await db.collection('items').add(req.body);
  res.json({ id: doc.id, ...req.body });
});

// Read
app.get('/api/items/:id', async (req, res) => {
  const doc = await db.collection('items').doc(req.params.id).get();
  res.json(doc.data());
});

// Update
app.put('/api/items/:id', async (req, res) => {
  await db.collection('items').doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete
app.delete('/api/items/:id', async (req, res) => {
  await db.collection('items').doc(req.params.id).delete();
  res.json({ success: true });
});
```

#### Supabase (Free Tier)
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Create
app.post('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([req.body]);
  if (error) return res.status(400).json(error);
  res.json(data);
});

// Read
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*');
  if (error) return res.status(400).json(error);
  res.json(data);
});
```

#### MongoDB Atlas (Professional+)
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

app.post('/api/posts', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});
```

---

### 🔐 AUTHENTICATION

#### Auth0 (Professional+)
```javascript
const { ManagementClient, AuthenticationClient } = require('auth0');

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = await auth0.users.create({
      email: req.body.email,
      password: req.body.password,
      user_metadata: { name: req.body.name }
    });
    res.json({ userId: user.user_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### JWT Custom Auth (Free Tier)
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
app.post('/api/auth/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = {
    id: uuidv4(),
    email: req.body.email,
    password: hashedPassword
  };
  users.push(user);
  res.json({ success: true, userId: user.id });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token });
});
```

---

### 📨 COMMUNICATION

#### Twilio SMS (Professional+)
```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/api/sms/send', async (req, res) => {
  try {
    const message = await client.messages.create({
      body: req.body.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.phoneNumber
    });
    res.json({ messageSid: message.sid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### SendGrid Email (Starter+)
```javascript
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/email/send', async (req, res) => {
  try {
    await sgMail.send({
      to: req.body.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### WebSocket Real-time (Free Tier)
```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'message',
          data: message
        }));
      }
    });
  });
});

// Client-side
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'join', userId: currentUser.id }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateChat(message.data);
};
```

---

### 🔧 OTHER INTEGRATIONS

#### Google APIs (Starter+)
```javascript
const { google } = require('googleapis');

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Google Sheets
const sheets = google.sheets({ version: 'v4', auth });

app.post('/api/sheets/append', async (req, res) => {
  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: req.body.spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [req.body.values]
      }
    });
    res.json(result.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### n8n Workflow Automation (Professional+)
```javascript
const axios = require('axios');

app.post('/api/workflows/trigger', async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.N8N_BASE_URL}/webhook/${req.body.webhookId}`,
      {
        data: req.body.data,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'X-N8N-API-KEY': process.env.N8N_API_KEY
        }
      }
    );
    res.json({ workflowId: response.data.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 🔑 API KEY MANAGEMENT

### Environment Variables Template
```bash
# AI Models
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...

# Payment Systems
STRIPE_API_KEY=sk_live_...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...

# Databases
FIREBASE_KEY={...json...}
SUPABASE_URL=https://...
SUPABASE_KEY=...
MONGODB_URI=mongodb+srv://...
AIRTABLE_API_KEY=key...

# Authentication
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...

# Communication
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
SENDGRID_API_KEY=SG...

# Other
N8N_BASE_URL=https://...
N8N_API_KEY=...
CALLBACK_URL=https://...
```

---

## ✅ INTEGRATION ACTIVATION CHECKLIST

When activating an integration:

1. ✅ User clicks integration card
2. ✅ Tier access check (error if insufficient)
3. ✅ API key prompt in chat
4. ✅ Format validation (e.g., "sk-" for Stripe)
5. ✅ Hash API key with SHA-256
6. ✅ Store hashed key in session
7. ✅ Test connection (mock for now)
8. ✅ Generate integration code
9. ✅ Update build session
10. ✅ Include in generated app
11. ✅ Confirm in chat: "✅ {name} activated!"

---

## 🚀 NEXT STEPS

1. Implement database storage for API keys
2. Add real connection testing for each integration
3. Create integration-specific setup wizards
4. Add integration monitoring & alerts
5. Implement integration versioning
6. Add integration examples in generated code
7. Create integration marketplace docs
8. Add integration analytics tracking

---

Built with ❤️ by physicistcolloh-png
