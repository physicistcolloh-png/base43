// Build Session Manager - Handles build state and locks
class BuildSessionManager {
  constructor() {
    this.sessions = new Map();
    this.locks = new Map(); // userId -> sessionId
  }

  createSession(userId, data) {
    const sessionId = require('uuid').v4();
    const session = {
      id: sessionId,
      userId,
      status: 'initializing',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: []
    };
    
    this.sessions.set(sessionId, session);
    this.locks.set(userId, sessionId);
    
    return session;
  }

  isLocked(userId) {
    return this.locks.has(userId);
  }

  getActiveBuild(userId) {
    const sessionId = this.locks.get(userId);
    return sessionId ? this.sessions.get(sessionId) : null;
  }

  addProgressStep(sessionId, step) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.steps.push({
        name: step,
        timestamp: new Date()
      });
      session.updatedAt = new Date();
    }
  }

  unlock(userId) {
    this.locks.delete(userId);
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
}

module.exports = new BuildSessionManager();
