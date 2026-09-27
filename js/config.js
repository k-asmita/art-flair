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
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // AI/ML Recommendation Service (Backend Model Results & Google Gemini AI)
    AI_RECOMMENDATIONS: (id) => `/recommendations/products/${id}`,
    AI_RECOMMENDATIONS_USER: '/recommendations/user',
    AI_RECOMMENDATIONS_PRODUCT: (id) => `/recommendations/products/${id}`,
    AI_MATCHER_RECOMMEND: '/recommendations/ai-advisor',
    AI_COMPATIBILITY_CHECK: '/recommendations/compatibility',

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

  // Google Gemini AI Recommendation Engine
  GEMINI_API_KEY: '',
  GEMINI_MODEL: 'gemini-1.5-flash',

  // Business Rules in Indian Rupees (INR)
  SHIPPING: {
    FREE_SHIPPING_THRESHOLD: 1499.00, // ₹1,499 for free shipping
    STANDARD_SHIPPING_FEE: 149.00,    // ₹149 standard delivery
    TAX_RATE: 0.12                   // 12% GST on artist supplies
  },

  // Centralized Storefront Promotional Code & Banner Configuration
  PROMO: {
    FEATURED_CODE: 'SABAHZ10',
    DISCOUNT_PERCENT: 10,
    DISCOUNT_RATE: 0.10,
    MIN_ORDER: 0
  },

  // Payment Gateway Configuration
  RAZORPAY_KEY_ID: 'rzp_test_TaSPXLlC9EXMVC'
};

// Helpers for Promotional Banner Content
function getPromoAnnouncementHTML() {
  const p = (typeof API_CONFIG !== 'undefined' && API_CONFIG.PROMO) ? API_CONFIG.PROMO : { FEATURED_CODE: 'SABAHZ10', DISCOUNT_PERCENT: 10 };
  return `Use code <strong class="announcement-code-pill" title="Click to copy code" data-copy-code="${p.FEATURED_CODE}">${p.FEATURED_CODE}</strong> for ${p.DISCOUNT_PERCENT}% off your first order!`;
}

function getCartPromoHintHTML() {
  const p = (typeof API_CONFIG !== 'undefined' && API_CONFIG.PROMO) ? API_CONFIG.PROMO : { FEATURED_CODE: 'SABAHZ10', DISCOUNT_PERCENT: 10 };
  return `<div class="cart-promo-hint"><span>💡 Have a code? Try <strong class="cart-promo-pill" role="button" tabindex="0" title="Click to apply ${p.FEATURED_CODE}" data-apply-code="${p.FEATURED_CODE}">${p.FEATURED_CODE}</strong> for ${p.DISCOUNT_PERCENT}% off!</span></div>`;
}

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

const CATEGORY_DIR_MAP = {
  'accessories': 'Accessories',
  'brushes': 'Brushes',
  'calligraphy': 'Calligraphy',
  'canvas': 'Canvas',
  'drawing-media': 'Drawing Media',
  'drawing media': 'Drawing Media',
  'drawing_media': 'Drawing Media',
  'easels': 'Easels',
  'painting-medium': 'Painting Medium',
  'painting medium': 'Painting Medium',
  'painting_medium': 'Painting Medium',
  'paints': 'Paints',
  'paper-pads': 'Paper & Pads',
  'paper & pads': 'Paper & Pads',
  'paper_pads': 'Paper & Pads',
  'pen-markers': 'Pen & Markers',
  'pen & markers': 'Pen & Markers',
  'pen_markers': 'Pen & Markers'
};

function resolveProductCategoryDir(catName) {
  if (!catName) return 'Accessories';
  const key = String(catName).toLowerCase().trim();
  return CATEGORY_DIR_MAP[key] || catName;
}

/**
 * Robust Product Photo Resolver across local static files and API endpoints.
 */
function resolveProductImageUrl(productOrUrl, productId) {
  const item = productOrUrl && typeof productOrUrl === 'object' ? productOrUrl : null;
  const rawCat = (item && (item.category || item.category_name || item.categoryId || item.category_id)) || 'Accessories';
  const dirName = resolveProductCategoryDir(rawCat);
  const raw = item
    ? (item.image || item.image_url || item.product_image || item.category_image_path || '')
    : (typeof productOrUrl === 'string' ? productOrUrl : '');

  if (raw && /^https?:\/\//i.test(raw)) return raw;

  if (raw) {
    const filename = raw.split('/').pop().split('\\').pop();
    if (filename && filename !== 'undefined' && filename !== 'null') {
      return `Products/${dirName}/${filename}`;
    }
  }

  return `Products/${dirName}/acrylic.jpg`;
}
