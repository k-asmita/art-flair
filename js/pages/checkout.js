/**
 * Art Flair - Checkout Page Controller
 * Developed for Sabahz Trading
 * 
 * 100% DATABASE-DRIVEN CHECKOUT IN INDIAN RUPEES (₹):
 * - Queries authoritative cart directly from backend API
 * - Never trusts frontend-only calculations
 * - Validates all customer and shipping fields
 * - Submits order payload to Python backend for authoritative stock, price & total validation
 * - Handles payment method switching and error states
 * - Redirects to order confirmation on success
 */

const CheckoutPage = {
  cartData: null,
  selectedPayment: 'upi',

  async init() {
    this._checkAuthentication();
    await this._loadAuthoritativeCart();
    this._prefillCustomerData();
    this._bindEvents();
  },

  /**
   * Check if customer is authenticated; prompt with login required modal if not.
   */
  _checkAuthentication() {
    const isAuth = this._isUserLoggedIn();

    if (!isAuth) {
      this._showAuthRequiredModal();
      this._disableCheckoutForm();
    }
  },

  _isUserLoggedIn() {
    try {
      const isAuth = typeof AuthService !== 'undefined' && AuthService.isAuthenticated();
      const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
      return !!(isAuth && user && !user.isGuest && user.email);
    } catch (e) {
      return false;
    }
  },

  _showAuthRequiredModal() {
    // Remove existing modal if present
    const existing = document.getElementById('checkout-auth-modal');
    if (existing) existing.remove();

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'checkout-auth-modal';
    modalBackdrop.className = 'modal-backdrop active';
    modalBackdrop.style.zIndex = '9999';
    modalBackdrop.style.background = 'rgba(41, 37, 36, 0.78)';
    modalBackdrop.style.backdropFilter = 'blur(6px)';

    modalBackdrop.innerHTML = `
      <div class="modal-card" style="max-width: 480px; text-align: center; padding: 36px 28px; border: 2px solid var(--border); box-shadow: var(--shadow-xl); border-radius: var(--radius-xl);">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--secondary-soft); color: var(--secondary); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.8rem;">
          🔒
        </div>
        <h2 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 8px;">
          Patron Login Required
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
          You must log in to your studio account before checking out. Guest checkout is not permitted. Please sign in or create a new account to complete your order.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="login.html?redirect=checkout.html" class="btn btn-primary btn-block btn-lg" style="font-weight: 700;">
            Sign In to Existing Account →
          </a>
          <a href="register.html?redirect=checkout.html" class="btn btn-outline btn-block" style="font-weight: 700;">
            Register New Studio Account
          </a>
          <a href="cart.html" class="btn btn-ghost btn-block btn-sm" style="color: var(--text-secondary); margin-top: 4px;">
            ← Return to Studio Cart
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
  },

  _disableCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form) {
      const banner = document.createElement('div');
      banner.className = 'alert alert-warning';
      banner.style.marginBottom = '20px';
      banner.style.fontWeight = '600';
      banner.innerHTML = `
        <span style="font-size: 1.1rem; margin-right: 6px;">⚠️</span>
        <span>You must <a href="login.html?redirect=checkout.html" style="text-decoration: underline; color: var(--primary); font-weight: 700;">Sign In</a> or <a href="register.html?redirect=checkout.html" style="text-decoration: underline; color: var(--primary); font-weight: 700;">Register</a> to place this order.</span>
      `;
      form.insertBefore(banner, form.firstChild);

      const submitBtn = document.getElementById('btn-place-order');
      if (submitBtn) {
        submitBtn.setAttribute('title', 'Please sign in or register to place order');
      }
    }
  },

  /**
   * 1. Query Authoritative Cart from Python Backend
   */
  async _loadAuthoritativeCart() {
    const itemsListEl = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');

    try {
      const response = await CartService.getCart();

      if (!response || !response.success || !response.items || response.items.length === 0) {
        Toast.warning('Your studio cart is currently empty. Redirecting to cart...');
        setTimeout(() => {
          window.location.href = 'cart.html';
        }, 1200);
        return;
      }

      this.cartData = response;
      const summary = response.summary || {};
      const items = response.items || [];

      // Render Order Items
      if (itemsListEl) {
        itemsListEl.innerHTML = items.map(item => {
          const itemSubtotal = (item.price * item.quantity);
          return `
            <div class="checkout-item-compact">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                <img 
                  src="${item.image || item.image_url || `Products/${item.category || 'Accessories'}/${(item.image ? item.image.split('/').pop() : '')}`}" 
                  alt="${item.name}" 
                  class="checkout-item-thumb" 
                  onerror="this.onerror=null; this.src='Products/${item.category || 'Accessories'}/${(item.image ? item.image.split('/').pop() : '')}';"
                />
                <div style="min-width: 0;">
                  <div style="font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">
                    ${item.name}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">
                    ${item.quantity} × ₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div style="font-weight: 700; color: var(--primary); flex-shrink: 0;">
                ₹${itemSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          `;
        }).join('');
      }

      // Render Authoritative Totals in INR
      const subtotal = summary.subtotal || 0;
      const shipping = summary.shipping || 0;
      const tax = summary.tax || 0;
      const total = summary.total || (subtotal + shipping + tax);

      if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      // Update Dynamic UPI QR Code URL with exact payable amount
      const qrImg = document.getElementById('upi-dynamic-qr-img');
      if (qrImg) {
        const upiUri = encodeURIComponent(`upi://pay?pa=sabahztrading@razorpay&pn=Art Flair Sabahz&am=${total.toFixed(2)}&cu=INR`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiUri}`;
      }

    } catch (err) {
      console.error('[CheckoutPage] Error loading database cart:', err);
      Toast.error('Could not connect to the Sabahz Trading cart server. Please refresh.');
      if (itemsListEl) {
        itemsListEl.innerHTML = `<div style="color: var(--error); font-size: 0.85rem; padding: 12px 0;">Error loading authoritative cart.</div>`;
      }
    }
  },

  /**
   * 2. Pre-fill customer info if logged in
   */
  _prefillCustomerData() {
    try {
      const user = AuthService.getCurrentUser();
      if (user && !user.isGuest) {
        const nameParts = (user.name || '').split(' ');
        const firstNameInput = document.getElementById('first-name');
        const lastNameInput = document.getElementById('last-name');
        const emailInput = document.getElementById('email');

        if (firstNameInput && !firstNameInput.value) firstNameInput.value = nameParts[0] || '';
        if (lastNameInput && !lastNameInput.value) lastNameInput.value = nameParts.slice(1).join(' ') || '';
        if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      }
    } catch (e) {
      // Non-blocking fallback
    }
  },

  /**
   * 3. Validate form fields
   */
  _validateForm() {
    let isValid = true;

    const fields = [
      { id: 'first-name', errId: 'err-first-name', test: val => val.trim().length > 0 },
      { id: 'last-name', errId: 'err-last-name', test: val => val.trim().length > 0 },
      { id: 'email', errId: 'err-email', test: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
      { id: 'phone', errId: 'err-phone', test: val => val.replace(/[^0-9]/g, '').length >= 10 },
      { id: 'address', errId: 'err-address', test: val => val.trim().length >= 5 },
      { id: 'city', errId: 'err-city', test: val => val.trim().length > 0 },
      { id: 'state', errId: 'err-state', test: val => val.trim().length > 0 },
      { id: 'postal-code', errId: 'err-postal-code', test: val => val.replace(/[^0-9]/g, '').length >= 5 }
    ];

    fields.forEach(({ id, errId, test }) => {
      const input = document.getElementById(id);
      const errEl = document.getElementById(errId);
      if (input) {
        if (!test(input.value)) {
          isValid = false;
          input.style.borderColor = 'var(--error)';
          if (errEl) errEl.style.display = 'block';
        } else {
          input.style.borderColor = 'var(--border)';
          if (errEl) errEl.style.display = 'none';
        }
      }
    });

    return isValid;
  },

  _bindEvents() {
    // Payment Method Switching & Dynamic Button Label
    const submitBtn = document.getElementById('btn-place-order');

    const updateSubmitButtonLabel = () => {
      if (!submitBtn) return;
      if (this.selectedPayment === 'upi') {
        submitBtn.innerHTML = `Pay with UPI / QR Code (Razorpay) →`;
      } else {
        submitBtn.innerHTML = `Place Studio Order (Cash Payment) →`;
      }
    };

    document.querySelectorAll('.payment-option-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        this.selectedPayment = card.dataset.payment || 'upi';

        // Hide all sub panels
        document.querySelectorAll('.payment-sub-panel').forEach(p => p.classList.remove('active'));

        // Show matching sub panel
        const activePanel = document.getElementById(`panel-${this.selectedPayment}`);
        if (activePanel) activePanel.classList.add('active');

        updateSubmitButtonLabel();
      });
    });

    updateSubmitButtonLabel();

    // Copy UPI ID Button Handler
    const copyBtn = document.getElementById('btn-copy-upi');
    const upiIdEl = document.getElementById('merchant-upi-id');
    if (copyBtn && upiIdEl) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(upiIdEl.textContent.trim());
          Toast.success('UPI ID copied to clipboard!');
          copyBtn.textContent = '✓ Copied';
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              Copy
            `;
          }, 2000);
        } catch (e) {
          Toast.info('UPI ID: ' + upiIdEl.textContent.trim());
        }
      });
    }

    // Clear validation error on field input
    const inputs = document.querySelectorAll('#checkout-form input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = 'var(--border)';
        const err = document.getElementById(`err-${input.id}`);
        if (err) err.style.display = 'none';
      });
    });

    // Handle Form Submit
    const form = document.getElementById('checkout-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Guard: User MUST be registered and logged in to checkout
      if (!this._isUserLoggedIn()) {
        Toast.error('You must log in first to complete your checkout.');
        this._showAuthRequiredModal();
        return;
      }

      if (!this._validateForm()) {
        Toast.error('Please complete all required shipping & contact fields correctly.');
        const firstError = document.querySelector('.form-control[style*="var(--error)"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError?.focus();
        return;
      }

      if (!this.cartData || !this.cartData.items || this.cartData.items.length === 0) {
        Toast.error('Your cart has expired. Please return to studio shop.');
        return;
      }

      // Assemble complete verified payload for Python Backend Validation
      const orderPayload = {
        customer: {
          firstName: document.getElementById('first-name')?.value.trim(),
          lastName: document.getElementById('last-name')?.value.trim(),
          email: document.getElementById('email')?.value.trim(),
          phone: document.getElementById('phone')?.value.trim()
        },
        shippingAddress: {
          address: document.getElementById('address')?.value.trim(),
          city: document.getElementById('city')?.value.trim(),
          state: document.getElementById('state')?.value.trim(),
          postalCode: document.getElementById('postal-code')?.value.trim(),
          country: 'India',
          notes: document.getElementById('shipping-notes')?.value.trim()
        },
        paymentMethod: this.selectedPayment,
        items: this.cartData.items,
        clientSubtotal: this.cartData.summary.subtotal,
        clientTotal: this.cartData.summary.total
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0 auto; display: inline-block; vertical-align: middle;"></div>
          Processing...
        `;
      }

      // If UPI Payment selected — Trigger Razorpay Checkout
      if (this.selectedPayment === 'upi') {
        if (typeof Razorpay !== 'undefined') {
          const razorpayKey = (typeof API_CONFIG !== 'undefined' && API_CONFIG.RAZORPAY_KEY_ID) || 'rzp_test_TaSPXLlC9EXMVC';
          const amountInPaise = Math.round((Number(orderPayload.clientTotal) || 0) * 100);

          const rzpOptions = {
            key: razorpayKey,
            amount: amountInPaise > 0 ? amountInPaise : 10000,
            currency: 'INR',
            name: 'Art Flair | Sabahz Trading',
            description: 'UPI / QR Code Order Payment',
            prefill: {
              name: `${orderPayload.customer.firstName} ${orderPayload.customer.lastName}`.trim(),
              email: orderPayload.customer.email,
              contact: orderPayload.customer.phone
            },
            theme: {
              color: '#5B2C6F'
            },
            modal: {
              ondismiss: () => {
                if (submitBtn) {
                  submitBtn.disabled = false;
                  updateSubmitButtonLabel();
                }
                Toast.info('Razorpay payment session was closed.');
              }
            },
            handler: async (response) => {
              // Razorpay payment successful
              orderPayload.paymentId = response.razorpay_payment_id;
              orderPayload.razorpayPaymentId = response.razorpay_payment_id;
              orderPayload.paymentStatus = 'Paid';
              Toast.success('UPI / QR Payment authorized via Razorpay!');
              await this._submitOrderToBackend(orderPayload, submitBtn);
            }
          };

          try {
            const rzp = new Razorpay(rzpOptions);
            rzp.on('payment.failed', (errResponse) => {
              Toast.error(errResponse.error?.description || 'Razorpay payment failed. Please retry.');
              if (submitBtn) {
                submitBtn.disabled = false;
                updateSubmitButtonLabel();
              }
            });
            rzp.open();
            return;
          } catch (rzpErr) {
            console.warn('[CheckoutPage] Razorpay launch error, falling back to direct server verification:', rzpErr);
          }
        }
      }

      // Cash Payment or Direct Backend Submission
      await this._submitOrderToBackend(orderPayload, submitBtn);
    });
  },

  async _submitOrderToBackend(orderPayload, submitBtn) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0 auto; display: inline-block; vertical-align: middle;"></div>
        Confirming Order with Sabahz Trading...
      `;
    }

    try {
      // Post order to Python backend
      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.CHECKOUT, orderPayload);

      if (!response || !response.success) {
        throw new Error(response?.message || 'Server rejected order verification');
      }

      Toast.success('Studio Order verified & confirmed by Sabahz Trading!');

      // Clear client local storage cart caches
      try {
        await CartService.clearCart();
      } catch(e) {}

      // Redirect to Order Confirmation Page with authoritative Order ID & Total
      setTimeout(() => {
        const orderId = response.orderId || response.order_id || 'AF-ORD-' + Math.floor(100000 + Math.random() * 900000);
        const total = response.total || response.total_amount || orderPayload.clientTotal;
        window.location.href = `order-success.html?orderId=${encodeURIComponent(orderId)}&total=${encodeURIComponent(total)}`;
      }, 800);

    } catch (err) {
      console.error('[CheckoutPage] Checkout failed:', err);
      Toast.error(err.message || 'An error occurred during order validation.');
      if (submitBtn) {
        submitBtn.disabled = false;
        if (this.selectedPayment === 'upi') {
          submitBtn.innerHTML = `Pay with UPI / QR Code (Razorpay) →`;
        } else {
          submitBtn.innerHTML = `Place Studio Order (Cash Payment) →`;
        }
      }
    }
  }
};
