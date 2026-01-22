import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AppBuilder.css';

// Get API base URL from environment or default to localhost
// For Codespaces: set REACT_APP_API_URL to the forwarded URL
// Example: REACT_APP_API_URL=https://codespace-name-5000.app.github.dev
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

function AppBuilder() {
  const [user] = useState({ id: 'demo-user', email: 'user@base43.app', username: 'user', tier: 'free', createdAt: new Date(), buildCount: 0, interactionsUsed: 0 });
  const [view, setView] = useState('builder'); // builder, pricing
  const [buildSession, setBuildSession] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [buildProgress, setBuildProgress] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'ai',
      message: `Welcome to base43! I'm your AI app builder. What would you like to create today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [integrations, setIntegrations] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedIntegrations, setSelectedIntegrations] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const startBuild = async (appName, description, requirements) => {
    try {
      const response = await axios.post(`${API_BASE}/api/builds/start`, {
        userId: user.id,
        appName,
        description,
        requirements
      });

      setBuildSession(response.data);
      setGeneratedCode(null);
      setSelectedIntegrations([]);

      // Start the build process
      simulateBuildProcess(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        setChatMessages(prev => [...prev, {
          role: 'ai',
          message: `Free tier limit reached (2 interactions). Please upgrade to continue building. <a href="${errorData.upgradeLink}" target="_blank">Upgrade now</a>`
        }]);
      } else {
        alert('Build start failed: ' + error.response?.data?.error);
      }
    }
  };

  const simulateBuildProcess = async (session) => {
    const steps = [
      { name: 'Understanding requirements', message: 'Analyzing your requirements…' },
      { name: 'Initializing project', message: 'Setting up project structure…' },
      { name: 'Generating frontend', message: 'Building UI components…' },
      { name: 'Generating backend', message: 'Setting up backend API…' },
      { name: 'Showing integrations', message: 'Loading available integrations…' },
      { name: 'Rendering live preview', message: 'Preparing preview…' },
      { name: 'Finalizing build', message: 'Build complete!' }
    ];

    for (let step of steps) {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: step.message,
        isProgress: true
      }]);

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Generate code
    const codeResponse = await axios.post(`${API_BASE}/api/generate/code`, {
      sessionId: session.id,
      userId: user.id
    });

    setGeneratedCode(codeResponse.data.code);

    // Fetch integrations
    const integrationsResponse = await axios.get(
      `${API_BASE}/api/integrations?userId=${user.id}`
    );
    setIntegrations(integrationsResponse.data);

    setChatMessages(prev => [...prev, {
      role: 'ai',
      message: 'Your app has been generated! Preview is ready below. Select integrations to enhance your app.',
      showIntegrations: true
    }]);

    setPreviewUrl(`data:text/html,${encodeURIComponent(generatePreviewHTML(codeResponse.data.code, user.tier))}`);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setChatMessages(prev => [...prev, {
      role: 'user',
      message: userMessage
    }]);

    setInputValue('');

    try {
      // Call backend AI endpoint
      const response = await axios.post(`${API_BASE}/api/chat`, {
        message: userMessage,
        conversationHistory: chatMessages.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.message
        }))
      });

      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: response.data.reply
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to local responses if API fails
      const input = userMessage.toLowerCase();
      
      if (input.includes('build') || input.includes('create') || input.includes('make')) {
        setChatMessages(prev => [...prev, {
          role: 'ai',
          message: 'I can help you build an app! What would you like to create?'
        }]);

        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            role: 'ai',
            message: 'Choose a template or describe your app:',
            showTemplates: true
          }]);
        }, 500);
      } else if (input.includes('pricing') || input.includes('upgrade')) {
        setView('pricing');
      } else {
        setChatMessages(prev => [...prev, {
          role: 'ai',
          message: 'I apologize, but I\'m having trouble connecting to the AI service. Please try again later.'
        }]);
      }
    }
  };

  const createFromTemplate = (template) => {
    startBuild(
      template.name,
      template.description,
      template.requirements
    );
  };

  const handleIntegrationSelect = async (integration) => {
    if (user.tier === 'free' && integration.requiresTier !== 'free') {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: `To use ${integration.name}, please upgrade to at least ${integration.requiresTier} tier.`
      }]);
      return;
    }

    const apiKey = prompt(`Enter your ${integration.name} API Key:`);
    if (!apiKey) return;

    try {
      await axios.post(
        `${API_BASE}/api/integrations/${integration.id}/activate`,
        {
          userId: user.id,
          sessionId: buildSession.id,
          apiKey
        }
      );

      setSelectedIntegrations(prev => [...prev, integration]);
      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: `✅ ${integration.name} activated successfully! Your app will now include this integration.`
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        message: `❌ Failed to activate ${integration.name}: ${error.response?.data?.error}`
      }]);
    }
  };

  if (view === 'pricing') {
    return <PricingView setView={setView} />;
  }

  return (
    <div className="app-builder">
      <header className="header">
        <div className="header-left">
          <h1>base43</h1>
          <span className="tier-badge">{user.tier.toUpperCase()}</span>
        </div>
        <div className="header-right">
          {user.tier === 'free' && (
            <button className="upgrade-btn" onClick={() => setView('pricing')}>
              Upgrade
            </button>
          )}
        </div>
      </header>

      <div className="builder-container">
        <div className="chat-panel">
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.role}`}>
                <div className="message-content">
                  {msg.message && typeof msg.message === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                  ) : msg.message}
                </div>

                {msg.showTemplates && (
                  <div className="templates">
                    {TEMPLATES.map((template, i) => (
                      <div key={i} className="template-card" onClick={() => createFromTemplate(template)}>
                        <h4>{template.name}</h4>
                        <p>{template.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {msg.showIntegrations && (
                  <div className="integrations-grid">
                    {integrations.map((integration, i) => (
                      <div
                        key={i}
                        className={`integration-card ${integration.isDisabled ? 'disabled' : ''}`}
                        onClick={() => !integration.isDisabled && handleIntegrationSelect(integration)}
                      >
                        <h4>{integration.name}</h4>
                        <p>{integration.description}</p>
                        {integration.isDisabled && (
                          <div className="upgrade-overlay">Upgrade to unlock</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your request... (e.g., 'build a todo app')"
              className="chat-input"
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>

        {(generatedCode || previewUrl) && (
          <div className="preview-panel">
            <div className="preview-tabs">
              <button className="tab-btn active">Preview</button>
              <button className="tab-btn">Frontend Code</button>
              <button className="tab-btn">Backend Code</button>
            </div>
            <div className="preview-content">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="preview-frame"
                  title="App Preview"
                />
              ) : (
                <div className="preview-placeholder">Building preview...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PricingView({ setView }) {
  const plans = [
    { name: 'Free', monthlyPrice: 0, features: ['2 interactions', 'OpenAI only', 'Platform subdomain', 'With watermark'] },
    { name: 'Starter', monthlyPrice: 1500, features: ['Unlimited builds', 'Multiple AI models', 'Basic integrations', 'No watermark'] },
    { name: 'Professional', monthlyPrice: 2400, features: ['Everything in Starter', 'All integrations', 'Custom domains', 'API access'] },
    { name: 'Enterprise', monthlyPrice: 3500, features: ['Everything in Pro', 'Dedicated support', 'Custom branding', 'White-label'] }
  ];

  return (
    <div className="pricing-container">
      <button onClick={() => setView('builder')} className="back-btn">← Back to Builder</button>
      <h2>Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map((plan, idx) => (
          <div key={idx} className="pricing-card">
            <h3>{plan.name}</h3>
            <p className="price">KES {plan.monthlyPrice}/month</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            <a href="https://store.pesapal.com/base44bingwasokonidata" className="btn btn-primary">
              {plan.name === 'Free' ? 'Get Started' : 'Upgrade'}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const TEMPLATES = [
  {
    name: 'Todo App',
    description: 'Task management application',
    requirements: 'Create a todo app with add, edit, delete tasks'
  },
  {
    name: 'Blog Platform',
    description: 'Blogging system with posts',
    requirements: 'Build a blog platform with posts, comments, and categories'
  },
  {
    name: 'Portfolio Website',
    description: 'Showcase your work',
    requirements: 'Create a portfolio website with projects section'
  },
  {
    name: 'E-commerce Store',
    description: 'Product catalog and shopping',
    requirements: 'Build an e-commerce store with products and cart'
  }
];

function generatePreviewHTML(code, tier) {
  const watermark = tier === 'free' ? '<div style="position: absolute; top: 10px; right: 10px; font-size: 12px; opacity: 0.5; pointer-events: none;">Built with base43</div>' : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    #root { padding: 20px; }
  </style>
</head>
<body>
  <div id="root">
    ${watermark}
    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h1 style="color: #333; margin-bottom: 20px;">Your App Preview</h1>
      <p style="color: #666; line-height: 1.6;">This is a live preview of your generated app. The full frontend and backend code is ready to deploy.</p>
      <form style="margin-top: 20px;">
        <input type="text" placeholder="Try me..." style="padding: 10px; width: 100%; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;" />
        <button type="submit" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Submit</button>
      </form>
    </div>
  </div>
</body>
</html>
  `;
}

export default AppBuilder;
