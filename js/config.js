/**
 * Art Flair - Configuration & Environment Constants
 * Developed for Sabahz Trading
 */

const API_CONFIG = {
  // Base endpoint for live Python backend
  BASE_URL: 'http://localhost:5000/api',

  // Currency & Locale Constants
  CURRENCY_SYMBOL: '₹',
  CURRENCY_CODE: 'INR',
  LOCALE: 'en-IN',

  // Live Python Flask Backend Mode
  USE_MOCK_FALLBACK: false,

  ENDPOINTS: {
    // Products & Search
    PRODUCTS: '/products',
    SEARCH: '/search',
    SEARCH_SUGGESTIONS: '/search/suggestions',
    PRODUCT_DETAIL: (id) => `/products/${id}`,
    FEATURED_PRODUCTS: '/products/featured',
    BEST_SELLERS: '/products/best-sellers',
    CATEGORIES: '/categories',
    BRANDS: '/brands',

    // Cart (Database-driven)
    GET_CART: '/cart',
    ADD_TO_CART: '/cart/add',
    UPDATE_CART_ITEM: (id) => `/cart/items/${id}`,
    REMOVE_CART_ITEM: (id) => `/cart/items/${id}`,
    CLEAR_CART: '/cart/clear',

    // Wishlist (Database-driven)
    GET_WISHLIST: '/wishlist',
    ADD_TO_WISHLIST: '/wishlist/add',
    REMOVE_FROM_WISHLIST: (id) => `/wishlist/items/${id}`,
    CLEAR_WISHLIST: '/wishlist/clear',

    // Checkout & Orders
    CHECKOUT: '/orders/checkout',
    GET_ORDERS: '/orders',
    ORDER_STATUS: (id) => `/orders/${id}`,

    // Auth & Profile
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    USER_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',

    // AI/ML Recommendation Service (Backend Model Results)
    AI_RECOMMENDATIONS: (id) => `/recommendations/products/${id}`,
    AI_RECOMMENDATIONS_USER: '/recommendations/user',
    AI_RECOMMENDATIONS_PRODUCT: (id) => `/recommendations/products/${id}`,
    AI_MATCHER_RECOMMEND: '/ai/recommend-medium-kit',
    AI_COMPATIBILITY_CHECK: '/ai/check-compatibility',

    // Admin Management Endpoints
    ADMIN_STATS: '/admin/stats',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_PRODUCT_DETAIL: (id) => `/admin/products/${id}`,
    ADMIN_INVENTORY: '/admin/inventory',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
    ADMIN_CUSTOMERS: '/admin/customers',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_UPLOAD_IMAGE: '/admin/upload-image'
  },

  // Business Rules in Indian Rupees (INR)
  SHIPPING: {
    FREE_SHIPPING_THRESHOLD: 1499.00, // ₹1,499 for free shipping
    STANDARD_SHIPPING_FEE: 149.00,    // ₹149 standard delivery
    TAX_RATE: 0.12                   // 12% GST on artist supplies
  },

  // Payment Gateway Configuration
  RAZORPAY_KEY_ID: 'rzp_test_TaSPXLlC9EXMVC'
};

// Helper for clean INR formatting
function formatINR(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getApiOrigin() {
  return String(API_CONFIG.BASE_URL || '').replace(/\/api\/?$/, '');
}

/**
 * Point product photos at the Flask backend (Live Server cannot serve /api/images).
 */
function resolveProductImageUrl(productOrUrl, productId) {
  const item = productOrUrl && typeof productOrUrl === 'object' ? productOrUrl : null;
  const cat = (item && (item.category || item.category_name)) || 'Accessories';
  const raw = item
    ? (item.image || item.image_url || item.category_image_path || '')
    : (typeof productOrUrl === 'string' ? productOrUrl : '');

  if (raw && /^https?:\/\//i.test(raw)) return raw;
  if (raw && (raw.startsWith('Products/') || raw.startsWith('products/'))) return raw;
  if (raw) {
    const filename = raw.split('/').pop().split('\\').pop();
    if (filename) return `Products/${cat}/${filename}`;
  }
  return `Products/${cat}/acrylic.jpg`;
}
