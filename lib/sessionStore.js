/**
 * In-memory session store for chatbot conversations
 * Maps session_id -> array of message objects
 */

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Get conversation history for a session
   * @param {string} sessionId - Session identifier
   * @returns {Array} Array of message objects
   */
  getHistory(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    return this.sessions.get(sessionId);
  }

  /**
   * Add a message to session history
   * @param {string} sessionId - Session identifier
   * @param {string} role - 'user' or 'bot'
   * @param {string} content - Message content
   */
  addMessage(sessionId, role, content) {
    const history = this.getHistory(sessionId);
    history.push({ role, content });

    // Keep only last 20 messages to prevent memory overflow
    if (history.length > 20) {
      this.sessions.set(sessionId, history.slice(-20));
    }
  }

  /**
   * Clear conversation history for a session
   * @param {string} sessionId - Session identifier
   */
  clearHistory(sessionId) {
    this.sessions.set(sessionId, []);
  }

  /**
   * Format history as text for LLM context
   * @param {string} sessionId - Session identifier
   * @returns {string} Formatted conversation history
   */
  formatHistory(sessionId) {
    const history = this.getHistory(sessionId);
    let formatted = "";

    for (const msg of history) {
      if (msg.role === "user") {
        formatted += `Farmer: '${msg.content}'\n`;
      } else {
        formatted += `FarmStellar: '${msg.content}'\n`;
      }
    }

    return formatted;
  }

  /**
   * Get total number of sessions
   * @returns {number} Number of active sessions
   */
  getSessionCount() {
    return this.sessions.size;
  }
}

// Export singleton instance
export const sessionStore = new SessionStore();
