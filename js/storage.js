/**
 * Art Flair - Client Storage & Session Utilities (Multi-User Isolated)
 * Developed for Sabahz Trading
 * 
 * Ensures complete privacy and isolation between users:
 * - User 1 details (cart, profile, wishlist, orders) are NEVER displayed to User 2.
 * - Cleans session caches thoroughly on logout and user switch.
 */

const StorageUtil = {
  KEYS: {
    AUTH_TOKEN: 'artflair_auth_token',
    USER_INFO: 'artflair_user_info',
    SESSION_ID: 'artflair_session_id',
    RECENT_SEARCHES: 'artflair_recent_searches',
    WISHLIST_PREFIX: 'artflair_wishlist_',
    CART_PREFIX: 'artflair_cart_',
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

  resetSessionId() {
    const newSessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(this.KEYS.SESSION_ID, newSessionId);
    return newSessionId;
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

  getUserIdentifier() {
    const user = this.getUserInfo();
    if (user && user.email) {
      return user.email.toLowerCase().trim();
    }
    return this.getSessionId();
  },

  // User-isolated Wishlist
  getWishlist() {
    try {
      const userKey = this.KEYS.WISHLIST_PREFIX + this.getUserIdentifier();
      const raw = localStorage.getItem(userKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  toggleWishlist(productId) {
    const userKey = this.KEYS.WISHLIST_PREFIX + this.getUserIdentifier();
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
      added = true;
    }
    localStorage.setItem(userKey, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { list, productId, added } }));
    return added;
  },

  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  },

  /**
   * Complete Session Teardown
   * Ensures that when User 1 logs out, User 2 will NEVER see User 1's details
   */
  clearUserSession() {
    const user = this.getUserInfo();
    const userEmail = user?.email?.toLowerCase();

    // Clear main tokens and user info
    localStorage.removeItem(this.KEYS.AUTH_TOKEN);
    localStorage.removeItem(this.KEYS.USER_INFO);
    localStorage.removeItem('artflair_admin_user');
    localStorage.removeItem('artflair_admin_token');
    sessionStorage.clear();

    // Clear legacy un-scoped mock keys if any
    localStorage.removeItem(this.KEYS.DEV_MOCK_CART);
    localStorage.removeItem('artflair_wishlist_ids');
    localStorage.removeItem('af_dev_mock_profile');

    // Reset guest session to fresh ID
    this.resetSessionId();

    // Notify listeners
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: null }));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { summary: { itemCount: 0, total: 0 } } }));
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { count: 0 } }));
  }
};

window.StorageUtil = StorageUtil;
