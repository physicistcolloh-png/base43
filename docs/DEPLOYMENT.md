# Deployment Guide for base43

## Prerequisites
- Docker & Docker Compose (for containerized deployment)
- OpenAI API Key (for AI chat features)
- Supabase account (for database & auth)
- Node.js 18+ (for local development)

## Configuration

### 1. Get Your API Keys

**OpenAI API Key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

**Supabase Setup:**
1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. In Project Settings → API, copy:
   - `Project URL`
   - `anon public` key
   - `service_role` secret

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your keys:
```
OPENAI_API_KEY=sk-your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_random_secret_32_chars_minimum
```

## Local Development

### Using Docker Compose
```bash
docker-compose up
```

### Using npm directly
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Access: http://localhost:3000

## Production Deployment

### Option 1: Railway

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`

3. Railway auto-deploys on git push

### Option 2: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-your_key -a your-app-name
heroku config:set SUPABASE_URL=https://... -a your-app-name
heroku config:set SUPABASE_ANON_KEY=... -a your-app-name

# Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Go to DigitalOcean Console
2. Click "Create" → "Apps"
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Option 4: Self-Hosted (VPS)

```bash
# SSH into server
ssh user@your_vps_ip

# Clone repo
git clone https://github.com/your-repo/base43.git
cd base43

# Create .env file
nano .env
# Add all environment variables

# Start with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or with systemd (see below)
```

## Production Docker Compose

Use `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Using Systemd (VPS without Docker)

Create `/etc/systemd/system/base43-backend.service`:
```ini
[Unit]
Description=base43 Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/base43/backend
EnvironmentFile=/var/www/base43/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable base43-backend
sudo systemctl start base43-backend
```

## Nginx Configuration (for custom domain)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Install SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

## Database Setup (Supabase)

### Create Tables

Run in Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free',
  build_count INT DEFAULT 0,
  interactions_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Build Sessions Table
CREATE TABLE build_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'active',
  generated_code JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES build_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Monitoring

### Using PM2 (recommended for VPS)

```bash
npm install -g pm2

# Start backend
pm2 start backend/server.js --name "base43-backend"

# Start frontend (if not using Docker)
pm2 start "cd frontend && npm start" --name "base43-frontend"

# Save config
pm2 save

# Enable auto-restart on reboot
pm2 startup
```

### Logs
```bash
# Backend logs
pm2 logs base43-backend

# All logs
pm2 logs
```

## Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# API test
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

## Scaling

### Load Balancing
Use Nginx or HAProxy to distribute traffic across multiple backend instances:

```bash
# Start multiple backend processes on different ports
NODE_PORT=5001 pm2 start backend/server.js --name "base43-backend-1"
NODE_PORT=5002 pm2 start backend/server.js --name "base43-backend-2"
NODE_PORT=5003 pm2 start backend/server.js --name "base43-backend-3"
```

Configure Nginx upstream:
```nginx
upstream backend {
    server localhost:5001;
    server localhost:5002;
    server localhost:5003;
}

location /api/ {
    proxy_pass http://backend;
}
```

## Security

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use HTTPS only (redirect HTTP to HTTPS)
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your domain
- [ ] Use rate limiting (already enabled)
- [ ] Regularly update dependencies: `npm audit fix`
- [ ] Set up automated backups for Supabase
- [ ] Monitor API usage and set spending limits on OpenAI

## Troubleshooting

### OpenAI Error
- Check API key is valid
- Verify billing enabled on OpenAI account
- Check rate limits

### Supabase Connection Failed
- Verify URL and keys are correct
- Check network firewall rules
- Test connection: `curl https://your-project.supabase.co`

### High Memory Usage
- Restart backend: `pm2 restart base43-backend`
- Check for memory leaks: `node --prof backend/server.js`

### SSL Certificate Issues
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

## Support
For issues, check logs and visit:
- OpenAI API Docs: https://platform.openai.com/docs
- Supabase Docs: https://supabase.com/docs
- Express.js Docs: https://expressjs.com
