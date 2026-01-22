// User Manager - Handles user tier management and limits
class UserManager {
  constructor() {
    this.users = new Map();
    this.FREE_TIER_LIMITS = {
      buildLimit: 2,
      interactionLimit: 2,
      integrations: ['openai', 'firebase', 'supabase', 'jwt', 'websocket', 'rest_api'],
      canUseCustomDomains: false,
      canDownloadApps: false,
      hasWatermark: true
    };

    this.PAID_TIER_LIMITS = {
      starter: {
        buildLimit: null,
        interactionLimit: null,
        integrations: ['all'],
        canUseCustomDomains: false,
        canDownloadApps: false,
        hasWatermark: false
      },
      professional: {
        buildLimit: null,
        interactionLimit: null,
        integrations: ['all'],
        canUseCustomDomains: true,
        canDownloadApps: true,
        hasWatermark: false
      },
      enterprise: {
        buildLimit: null,
        interactionLimit: null,
        integrations: ['all'],
        canUseCustomDomains: true,
        canDownloadApps: true,
        hasWatermark: false
      }
    };
  }

  createUser(email, username, password) {
    const userId = require('uuid').v4();
    const user = {
      id: userId,
      email,
      username,
      passwordHash: this.hashPassword(password),
      tier: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
      buildCount: 0,
      interactionsUsed: 0,
      customDomain: null,
      isActive: true
    };

    this.users.set(userId, user);
    return user;
  }

  upgradeUser(userId, newTier) {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    user.tier = newTier;
    user.updatedAt = new Date();
    
    // Reset interaction counters for new tier
    user.interactionsUsed = 0;

    return user;
  }

  canBuild(userId) {
    const user = this.users.get(userId);
    if (!user) return false;

    const limits = user.tier === 'free' 
      ? this.FREE_TIER_LIMITS 
      : this.PAID_TIER_LIMITS[user.tier];

    if (limits.buildLimit === null) return true;
    return user.buildCount < limits.buildLimit;
  }

  canUseInteraction(userId) {
    const user = this.users.get(userId);
    if (!user) return false;

    const limits = user.tier === 'free' 
      ? this.FREE_TIER_LIMITS 
      : this.PAID_TIER_LIMITS[user.tier];

    if (limits.interactionLimit === null) return true;
    return user.interactionsUsed < limits.interactionLimit;
  }

  canUseIntegration(userId, integrationId) {
    const user = this.users.get(userId);
    if (!user) return false;

    const limits = user.tier === 'free' 
      ? this.FREE_TIER_LIMITS 
      : this.PAID_TIER_LIMITS[user.tier];

    if (limits.integrations[0] === 'all') return true;
    return limits.integrations.includes(integrationId);
  }

  hasWatermark(userId) {
    const user = this.users.get(userId);
    if (!user) return true;

    const limits = user.tier === 'free' 
      ? this.FREE_TIER_LIMITS 
      : this.PAID_TIER_LIMITS[user.tier];

    return limits.hasWatermark || false;
  }

  incrementBuildCount(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.buildCount += 1;
      user.updatedAt = new Date();
    }
  }

  incrementInteractionCount(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.interactionsUsed += 1;
      user.updatedAt = new Date();
    }
  }

  getUserLimits(userId) {
    const user = this.users.get(userId);
    if (!user) return null;

    return user.tier === 'free' 
      ? this.FREE_TIER_LIMITS 
      : this.PAID_TIER_LIMITS[user.tier];
  }

  hashPassword(password) {
    return require('bcryptjs').hashSync(password, 10);
  }

  getUser(userId) {
    return this.users.get(userId);
  }
}

module.exports = new UserManager();
