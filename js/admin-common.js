/**
 * Art Flair - Admin Common Layout & Security Guard Component
 * Developed for Sabahz Trading
 */

const AdminAuth = {
  KEYS: {
    ADMIN_USER: 'artflair_admin_user',
    ADMIN_TOKEN: 'artflair_admin_token'
  },

  // Authorized master administrator email
  ADMIN_EMAIL: 'admin@gmail.com',

  getAdminUser() {
    try {
      const raw = sessionStorage.getItem(this.KEYS.ADMIN_USER) || localStorage.getItem(this.KEYS.ADMIN_USER);
      if (!raw) return null;
      const user = JSON.parse(raw);
      if (user && user.role === 'admin' && String(user.email).toLowerCase() === this.ADMIN_EMAIL) {
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  getAdminToken() {
    return sessionStorage.getItem(this.KEYS.ADMIN_TOKEN) || localStorage.getItem(this.KEYS.ADMIN_TOKEN) || null;
  },

  isAuthenticated() {
    const admin = this.getAdminUser();
    const token = this.getAdminToken();
    return !!(admin && token);
  },

  setAdminSession(user, token, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.KEYS.ADMIN_USER, JSON.stringify(user));
    storage.setItem(this.KEYS.ADMIN_TOKEN, token);
    
    // Also clear session storage if rememberMe is selected to prevent duplicate stale states
    if (rememberMe) {
      sessionStorage.removeItem(this.KEYS.ADMIN_USER);
      sessionStorage.removeItem(this.KEYS.ADMIN_TOKEN);
    } else {
      localStorage.removeItem(this.KEYS.ADMIN_USER);
      localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
    }
  },

  clearAdminSession() {
    sessionStorage.removeItem(this.KEYS.ADMIN_USER);
    sessionStorage.removeItem(this.KEYS.ADMIN_TOKEN);
    localStorage.removeItem(this.KEYS.ADMIN_USER);
    localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
  },

  logout() {
    this.clearAdminSession();
    window.location.href = 'login.html';
  },

  /**
   * Display the mandatory popup restriction dialog box
   */
  showRestrictionModal({ customMessage, redirectOnClose = true } = {}) {
    // Remove existing modal if present
    const existing = document.getElementById('admin-restriction-modal-root');
    if (existing) existing.remove();

    const restrictionMessage = customMessage || 'if you have correct login credintials then you can login in admin panel otherwise you cannot login';

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'admin-restriction-modal-root';
    modalBackdrop.className = 'admin-restriction-backdrop';

    modalBackdrop.innerHTML = `
      <div class="admin-restriction-modal" role="dialog" aria-modal="true" aria-labelledby="restriction-title">
        <div class="admin-restriction-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 class="admin-restriction-title" id="restriction-title">Administrator Access Restricted</h2>

        <div class="admin-restriction-quote-box">
          ⚠️ ${restrictionMessage}
        </div>

        <p class="admin-restriction-desc">
          The Art Flair Admin Atelier requires verified master administrator credentials. 
          Customer atelier accounts and unverified requests cannot access or view this management portal.
        </p>

        <div class="admin-restriction-buttons">
          <button type="button" class="btn-admin btn-admin-primary" id="btn-modal-go-login" style="width: 100%; justify-content: center; padding: 12px;">
            Go to Admin Login
          </button>
          <button type="button" class="btn-admin btn-admin-secondary" id="btn-modal-go-store" style="width: 100%; justify-content: center; padding: 12px;">
            Return to Public Store
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Event listeners
    document.getElementById('btn-modal-go-login')?.addEventListener('click', () => {
      window.location.href = 'login.html';
    });

    document.getElementById('btn-modal-go-store')?.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  },

  /**
   * Route guard for all admin pages.
   * If customer/guest attempts access, blocks page rendering and displays restriction popup.
   */
  guardPage() {
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.endsWith('login.html')) {
      // If already authenticated as admin and on login page, redirect to dashboard
      if (this.isAuthenticated()) {
        window.location.href = 'dashboard.html';
      }
      return true;
    }

    if (!this.isAuthenticated()) {
      // Hide body content to prevent unauthorized viewing of sensitive admin data
      const mainContainer = document.querySelector('.admin-main') || document.body;
      if (mainContainer) {
        mainContainer.style.display = 'none';
      }

      // Show popup box with restriction message
      this.showRestrictionModal({ redirectOnClose: true });
      return false;
    }

    return true;
  },

  /**
   * Authenticate admin with user id admin@gmail.com and password Admin@24
   */
  async login(email, password, rememberMe = false) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    // Verify exact admin credentials
    if (cleanEmail !== this.ADMIN_EMAIL || cleanPassword !== 'Admin@24') {
      this.showRestrictionModal();
      throw new Error('if you have correct login credintials then you can login in admin panel otherwise you cannot login');
    }

    try {
      let response;
      try {
        response = await ApiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
          email: cleanEmail,
          password: cleanPassword,
          remember_me: rememberMe
        });
      } catch (err) {
        // Fallback for mock/offline execution
        response = {
          success: true,
          token: 'admin_token_' + Date.now(),
          user: {
            id: 'ADM-001',
            name: 'Sabahz Admin',
            email: 'admin@gmail.com',
            role: 'admin',
            discipline: 'Master Atelier Management',
            isGuest: false
          }
        };
      }

      if (response && response.success) {
        const user = response.user || {
          id: 'ADM-001',
          name: 'Sabahz Admin',
          email: 'admin@gmail.com',
          role: 'admin',
          isGuest: false
        };
        const token = response.token || ('admin_token_' + Date.now());

        if (user.role !== 'admin' || user.email.toLowerCase() !== this.ADMIN_EMAIL) {
          this.showRestrictionModal();
          throw new Error('if you have correct login credintials then you can login in admin panel otherwise you cannot login');
        }

        this.setAdminSession(user, token, rememberMe);
        return { success: true, user, token };
      }

      this.showRestrictionModal();
      throw new Error('if you have correct login credintials then you can login in admin panel otherwise you cannot login');
    } catch (e) {
      if (!document.getElementById('admin-restriction-modal-root')) {
        this.showRestrictionModal();
      }
      throw e;
    }
  }
};

const AdminLayout = {
  render(activePageKey) {
    // 1. Guard page access
    if (!AdminAuth.guardPage()) {
      return;
    }

    const currentAdmin = AdminAuth.getAdminUser() || { name: 'Sabahz Admin', email: 'admin@gmail.com' };
    const sidebarEl = document.getElementById('admin-sidebar-container');

    if (sidebarEl) {
      sidebarEl.innerHTML = `
        <aside class="admin-sidebar" id="admin-sidebar">
          <div class="admin-sidebar-brand">
            <div class="admin-brand-icon">AF</div>
            <div>
              <div class="admin-brand-title">Art<span>Flair</span></div>
              <span class="admin-brand-badge">Sabahz Admin Atelier</span>
            </div>
          </div>

          <nav class="admin-sidebar-nav">
            <div class="admin-nav-section-title">Core Operations</div>
            
            <a href="dashboard.html" class="admin-nav-item ${activePageKey === 'dashboard' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              <span>Dashboard</span>
            </a>

            <a href="products.html" class="admin-nav-item ${activePageKey === 'products' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 19 7-7 3 3-7 7-3-3z"/>
                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="m2 2 7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <span>Products</span>
            </a>

            <a href="inventory.html" class="admin-nav-item ${activePageKey === 'inventory' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
              <span>Inventory</span>
            </a>

            <a href="orders.html" class="admin-nav-item ${activePageKey === 'orders' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span>Orders</span>
            </a>

            <div class="admin-nav-section-title">Relationships & Insights</div>

            <a href="customers.html" class="admin-nav-item ${activePageKey === 'customers' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Customers</span>
            </a>

            <a href="analytics.html" class="admin-nav-item ${activePageKey === 'analytics' ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="18" y1="20" y2="10"/>
                <line x1="12" x2="12" y1="20" y2="4"/>
                <line x1="6" x2="6" y1="20" y2="14"/>
              </svg>
              <span>Analytics</span>
            </a>

            <div class="admin-nav-section-title">Storefront</div>
            <a href="../index.html" class="admin-nav-item" target="_blank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" x2="21" y1="14" y2="3"/>
              </svg>
              <span>View Public Studio</span>
            </a>
          </nav>

          <div class="admin-sidebar-footer">
            <div class="admin-user-info">
              <div class="admin-avatar">SA</div>
              <div>
                <div class="admin-user-name">${currentAdmin.name}</div>
                <div class="admin-user-role">Master Atelier Access</div>
              </div>
            </div>
            <button type="button" class="btn-admin-danger btn-admin-sm" id="btn-admin-logout" title="Sign out of Admin">
              Sign Out
            </button>
          </div>
        </aside>
      `;
    }

    // Attach logout event
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
      if (confirm('Sign out of Art Flair Admin Portal?')) {
        AdminAuth.logout();
      }
    });
  }
};

// Global exports
window.AdminAuth = AdminAuth;
window.AdminLayout = AdminLayout;
