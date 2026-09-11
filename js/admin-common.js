/**
 * Art Flair - Admin Common Layout & Sidebar Component
 * Developed for Sabahz Trading
 */

const AdminLayout = {
  render(activePageKey) {
    const sidebarEl = document.getElementById('admin-sidebar-container');
    const headerEl = document.getElementById('admin-header-container');

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
                <div class="admin-user-name">Sabahz Admin</div>
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
        window.location.href = '../login.html';
      }
    });
  }
};
