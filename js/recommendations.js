/**
 * Art Flair - AI/ML Recommendation Module
 * Developed for Sabahz Trading
 * 
 * FRONTEND AI RECOMMENDATION CLIENT & RENDERER:
 * - Does NOT implement ML algorithms on the client (Python backend generates all model predictions)
 * - Communicates with backend recommendation endpoints
 * - Renders polished "Recommended For You" UI using the reusable ProductCardComponent
 * - Handles Cold-Start / New Users with honest "Explore more products to receive personalized recommendations" messaging
 * - Handles Loading, Empty, and Error states
 * - Modular and reusable across homepage, product-details, customer profile/orders, and shop catalog
 */

const RecommendationEngine = {
  /**
   * 1. Query recommendation data from the Python backend
   * @param {Object} options - { productId, userId, category, limit }
   */
  async getRecommendations(options = {}) {
    const { productId, category, limit = 4 } = options;

    let endpoint = API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS_USER;
    if (productId) {
      endpoint = API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS_PRODUCT 
        ? API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS_PRODUCT(productId)
        : API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS(productId);
    }

    try {
      const response = await ApiClient.get(endpoint);

      if (!response || !response.success) {
        throw new Error(response?.message || 'Server did not return recommendation data');
      }

      return {
        success: true,
        isPersonalized: !!response.isPersonalized,
        hasSufficientData: response.hasSufficientData !== false,
        recommendations: response.recommendations || [],
        rationale: response.rationale || response.aiInsight || '',
        message: response.message || '',
        algorithm: response.algorithm || 'Neural Matrix Factorization v2.4'
      };
    } catch (err) {
      console.warn('[RecommendationEngine] Backend query failed:', err);
      return {
        success: false,
        isPersonalized: false,
        hasSufficientData: false,
        recommendations: [],
        error: err.message
      };
    }
  },

  /**
   * 2. Render the "Recommended For You" Section into any DOM target
   * @param {string|HTMLElement} target - ID or DOM element
   * @param {Object} config - { title, productId, showBadge, columns }
   */
  async render(target, config = {}) {
    const container = typeof target === 'string' ? document.getElementById(target) : target;
    if (!container) return;

    const {
      title = 'Recommended For You',
      productId = null,
      showBadge = true,
      columns = 4
    } = config;

    // A. Render Loading State (Shimmer Skeleton Cards)
    container.innerHTML = `
      <section class="recommendations-section" aria-label="AI Recommendations" style="padding: 40px 0;">
        <div class="container">
          <div class="section-header" style="margin-bottom: 24px;">
            <div class="skeleton" style="width: 140px; height: 24px; border-radius: 12px; margin-bottom: 8px;"></div>
            <div class="skeleton" style="width: 280px; height: 36px; border-radius: 6px; margin-bottom: 8px;"></div>
            <div class="skeleton" style="width: 380px; height: 18px; border-radius: 4px;"></div>
          </div>
          <div class="grid grid-cols-${columns} gap-lg">
            ${Array.from({ length: columns }).map(() => `
              <div class="skeleton" style="height: 380px; border-radius: var(--radius-lg);"></div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    // B. Fetch data from backend
    const result = await this.getRecommendations({ productId });

    // C. Handle Error State
    if (!result.success) {
      container.innerHTML = `
        <section class="recommendations-section" style="padding: 30px 0;">
          <div class="container">
            <div class="empty-state" style="padding: 30px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl);">
              <div style="font-size: 2rem; margin-bottom: 8px;">🤖</div>
              <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 4px;">AI Recommendation Service Temporarily Offline</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem; max-width: 440px; margin: 0 auto 16px;">
                We could not establish a connection to the Sabahz Trading recommendation model.
              </p>
              <button type="button" class="btn btn-outline btn-sm" onclick="RecommendationEngine.render('${container.id}', ${JSON.stringify(config).replace(/"/g, '&quot;')})">
                Retry Connection
              </button>
            </div>
          </div>
        </section>
      `;
      return;
    }

    const { isPersonalized, hasSufficientData, recommendations, rationale, message, algorithm } = result;

    // D. Empty State (No recommendations returned at all)
    if (!recommendations || recommendations.length === 0) {
      container.innerHTML = '';
      return;
    }

    // E. Subtitle & Badge Logic (Accurate and honest for New Users vs Returning Patrons)
    let subtitleHTML = '';
    let kickerHTML = '';

    if (isPersonalized) {
      kickerHTML = `
        <span class="section-kicker" style="background: var(--powder-blue-soft); color: var(--primary);">
          ✨ AI-Curated For Your Studio
        </span>
      `;
      subtitleHTML = rationale || 'Personalized based on your atelier browsing history and archival pigment preferences.';
    } else {
      // New user cold-start: Explicitly honest messaging
      kickerHTML = `
        <span class="section-kicker" style="background: var(--butter-yellow-soft); color: #8A6400;">
          💡 Curated Studio Discovery
        </span>
      `;
      subtitleHTML = message || 'Explore more products to receive personalized recommendations.';
    }

    // F. Render Populated Section with Reusable ProductCardComponent
    container.innerHTML = `
      <section class="recommendations-section" aria-label="Recommended For You" style="padding: var(--space-2xl) 0; background: var(--bg-alt); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: 16px;">
            <div>
              ${showBadge ? kickerHTML : ''}
              <h2 style="color: var(--primary); font-size: 2rem; margin-top: 6px; margin-bottom: 4px;">
                ${title}
              </h2>
              <p style="color: var(--text-secondary); margin-bottom: 0; font-size: 0.95rem; max-width: 650px;">
                ${subtitleHTML}
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                Model: ${isPersonalized ? 'Active' : 'Baseline Discovery'}
              </span>
              <a href="ai-matcher.html" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
                <span>🎯 Custom AI Advisor</span>
              </a>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-4 gap-lg recommendations-grid">
            ${recommendations.map(prod => ProductCardComponent.createHTML(prod)).join('')}
          </div>
        </div>
      </section>
    `;

    // G. Bind interactive card listeners (Add to Cart, Wishlist Toggle, Quick View)
    ProductCardComponent.bindEvents();
  }
};

// Global shorthand export for backwards compatibility
const getRecommendations = (opts) => RecommendationEngine.getRecommendations(opts);
