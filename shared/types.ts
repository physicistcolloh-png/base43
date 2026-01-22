// User & Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
  buildCount: number;
  interactionsUsed: number;
}

// Build Session Types
export interface BuildSession {
  id: string;
  userId: string;
  status: 'initializing' | 'generating-frontend' | 'generating-backend' | 'integrating' | 'previewing' | 'completed' | 'error';
  appName: string;
  description: string;
  requirements: string;
  generatedCode: {
    frontend?: string;
    backend?: string;
  };
  selectedIntegrations: Integration[];
  createdAt: Date;
  updatedAt: Date;
  previewUrl?: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  category: 'ai' | 'payment' | 'database' | 'auth' | 'communication' | 'other';
  description: string;
  requiresApiKey: boolean;
  isActive: boolean;
  requiresTier: 'free' | 'starter' | 'professional' | 'enterprise';
}

export interface ActivatedIntegration {
  integrationId: string;
  buildSessionId: string;
  apiKeyHash: string;
  validatedAt: Date;
}

// Code Generation Types
export interface GenerationRequest {
  appName: string;
  description: string;
  requirements: string;
  framework: 'react' | 'vue' | 'angular';
  backend: 'express' | 'fastapi' | 'django';
}

export interface GeneratedApp {
  frontend: string;
  backend: string;
  integrations: string[];
}

// Pricing Types
export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  annualDiscount: number;
  currency: string;
  features: string[];
  buildLimit: number;
  interactionLimit: number;
  canUseIntegrations: boolean;
  canUseCustomDomains: boolean;
  canDownloadApps: boolean;
}

// Build Progress Types
export interface BuildProgress {
  step: string;
  status: 'started' | 'in-progress' | 'completed';
  message: string;
  timestamp: Date;
}
