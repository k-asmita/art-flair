/**
 * Art Flair - Client Storage & Session Utilities
 * Sabahz Trading
 */

const StorageUtil = {
  KEYS: {
    AUTH_TOKEN: 'artflair_auth_token',
    USER_INFO: 'artflair_user_info',
    SESSION_ID: 'artflair_session_id',
    RECENT_SEARCHES: 'artflair_recent_searches',
    WISHLIST_ITEMS: 'artflair_wishlist_ids',
    // Fallback simulation key only for development preview when backend is not running
    DEV_MOCK_CART: 'artflair_dev_mock_cart'
  },

  // Generate or retrieve persistent guest session ID for database cart identification
  getSessionId() {
    let sessionId = localStorage.getItem(this.KEYS.SESSION_ID);
    if (!sessionId) {
      sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(this.KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
  },

  getAuthToken() {
    return localStorage.getItem(this.KEYS.AUTH_TOKEN);
  },

  setAuthToken(token) {
    if (token) {
      localStorage.setItem(this.KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(this.KEYS.AUTH_TOKEN);
    }
  },

  getUserInfo() {
    try {
      const raw = localStorage.getItem(this.KEYS.USER_INFO);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setUserInfo(user) {
    if (user) {
      localStorage.setItem(this.KEYS.USER_INFO, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.KEYS.USER_INFO);
    }
  },

  // Wishlist UI helper
  getWishlist() {
    try {
      const raw = localStorage.getItem(this.KEYS.WISHLIST_ITEMS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  toggleWishlist(productId) {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
      added = true;
    }
    localStorage.setItem(this.KEYS.WISHLIST_ITEMS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { list, productId, added } }));
    return added;
  },

  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  }
};
