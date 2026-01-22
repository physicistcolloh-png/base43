// Code Generator - Generates frontend and backend code
class CodeGenerator {
  generateReactComponent(appName, description, integrations = []) {
    const componentName = this.toPascalCase(appName);
    
    return `
import React, { useState, useEffect } from 'react';
import './styles.css';

export default function ${componentName}() {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Component mounted
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Add your API call here
      console.log('Form submitted:', state);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>${appName}</h1>
        <p>${description}</p>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter value"
            onChange={(e) => setState({ ...state, value: e.target.value })}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </main>

      <footer className="footer">
        ${integrations.length > 0 ? '<!-- Integrations: ' + integrations.map(i => i.name).join(', ') + ' -->' : ''}
      </footer>
    </div>
  );
}
    `.trim();
  }

  generateExpressBackend(appName, integrations = []) {
    const importStatements = integrations
      .filter(i => i.requiresApiKey)
      .map(i => `// const ${i.id} = require('${i.id}');`)
      .join('\n');

    return `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

${importStatements}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    app: '${appName}',
    timestamp: new Date().toISOString()
  });
});

// Main API endpoint
app.post('/api/submit', (req, res) => {
  try {
    const { data } = req.body;
    
    // Validate input
    if (!data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Process data
    const result = {
      success: true,
      message: 'Data processed successfully',
      data: data,
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(\`${appName} API running on port \${PORT}\`);
});

module.exports = app;
    `.trim();
  }

  generateDockerfile(appName) {
    return `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
    `.trim();
  }

  generateEnvFile() {
    return `
NODE_ENV=production
PORT=3001
DATABASE_URL=
API_KEY=
CORS_ORIGIN=*
    `.trim();
  }

  toPascalCase(str) {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

module.exports = new CodeGenerator();
