/**
 * Art Flair - AI Medium & Art Supplies Matcher Wizard Controller
 * Sabahz Trading
 * 
 * Guides artists through an interactive assessment and outputs customized
 * supply recommendations powered by the AI service.
 */

const AiMatcherPage = {
  currentStep: 1,
  answers: {
    medium: 'oil',
    skillLevel: 'intermediate',
    projectType: 'portrait',
    budget: 'mid'
  },
  recommendedBundle: null,

  init() {
    this._bindEvents();
    this.updateStepUI();
  },

  updateStepUI() {
    // Hide all panels
    document.querySelectorAll('.wizard-step-panel').forEach(p => p.classList.remove('active'));
    // Show current panel
    document.getElementById(`step-${this.currentStep}`)?.classList.add('active');

    // Update node states
    document.querySelectorAll('.wizard-step-node').forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepNum === this.currentStep) {
        node.classList.add('active');
      } else if (stepNum < this.currentStep) {
        node.classList.add('completed');
      }
    });

    // Toggle Back button
    const backBtn = document.getElementById('btn-wizard-prev');
    if (backBtn) {
      backBtn.style.visibility = this.currentStep > 1 && this.currentStep < 5 ? 'visible' : 'hidden';
    }
  },

  _bindEvents() {
    // Card option selections
    document.addEventListener('click', (e) => {
      const choiceCard = e.target.closest('.ai-choice-card');
      if (choiceCard) {
        const grid = choiceCard.closest('.ai-option-cards-grid');
        grid.querySelectorAll('.ai-choice-card').forEach(c => c.classList.remove('selected'));
        choiceCard.classList.add('selected');

        const key = choiceCard.dataset.key;
        const val = choiceCard.dataset.val;
        if (key && val) {
          this.answers[key] = val;
        }
      }
    });

    // Next step button
    document.getElementById('btn-wizard-next')?.addEventListener('click', async () => {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.updateStepUI();
      } else if (this.currentStep === 4) {
        // Run AI Matching computation
        await this.generateResults();
      }
    });

    // Prev step button
    document.getElementById('btn-wizard-prev')?.addEventListener('click', () => {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.updateStepUI();
      }
    });

    // 1-Click Add Entire Bundle to Cart
    document.addEventListener('click', async (e) => {
      if (e.target.closest('#btn-add-ai-bundle') && this.recommendedBundle) {
        const btn = e.target.closest('#btn-add-ai-bundle');
        btn.disabled = true;
        btn.textContent = 'Adding AI Kit to Cart...';

        try {
          for (const item of this.recommendedBundle.items) {
            await CartService.addToCart(item.id, 1);
          }
          Toast.success('Complete AI-Curated Kit added to your Studio Cart!');
          setTimeout(() => {
            window.location.href = 'cart.html';
          }, 800);
        } catch (err) {
          Toast.error(err.message || 'Error adding kit items');
          btn.disabled = false;
          btn.textContent = 'Add Full AI Kit to Studio Cart';
        }
      }
    });
  },

  async generateResults() {
    this.currentStep = 5;
    this.updateStepUI();

    const resultsContainer = document.getElementById('ai-results-content');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 2.5rem; margin-bottom: 16px; animation: pulse-dot 1s infinite;">✨</div>
          <h3>Sabahz AI Model is Analyzing Material Compatibility...</h3>
          <p style="color: var(--color-text-secondary);">Cross-referencing pigment lightfastness, binder viscosity, and surface absorption rates...</p>
        </div>
      `;
    }

    try {
      const result = await AiService.recommendSupplyKit(this.answers);
      this.recommendedBundle = result.bundle;

      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="ai-results-wrapper">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
              <span class="ai-match-score-badge">
                ✓ ${result.compatibilityScore}% Chemical & Archival Compatibility
              </span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">
                Sabahz Certified Match
              </span>
            </div>

            <h3 style="font-size: 1.6rem; margin-bottom: 8px;">Your Personalized AI ${result.aiAnalysis.medium} Studio Kit</h3>
            <p style="color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.6;">
              ${result.aiAnalysis.explanation}
            </p>

            <div style="background: var(--color-card); border-left: 4px solid var(--color-secondary); padding: 12px 16px; border-radius: 8px; font-size: 0.88rem; color: var(--color-text-main); margin-bottom: 24px;">
              💡 <strong>AI Studio Pairing Tip:</strong> ${result.aiAnalysis.pairingAdvice}
            </div>

            <h4 style="font-size: 1.1rem; margin-bottom: 12px;">Recommended Archival Materials in this Bundle:</h4>
            
            <div class="bundle-items-list">
              ${result.bundle.items.map(item => `
                <div class="bundle-item-card">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${item.image}" alt="${item.name}" class="bundle-item-img" />
                    <div>
                      <div style="font-size: 0.75rem; color: var(--color-secondary); font-weight: 700; text-transform: uppercase;">${item.brand} • ${item.category}</div>
                      <strong style="font-size: 0.95rem;">${item.name}</strong>
                    </div>
                  </div>
                  <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">
                    ₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--border); margin-top: 20px; flex-wrap: wrap; gap: 16px;">
              <div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Curated Bundle Total:</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); font-family: var(--font-heading);">
                  ₹${result.bundle.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <button type="button" class="btn btn-primary btn-lg" id="btn-add-ai-bundle">
                Add Entire AI Bundle to Studio Cart →
              </button>
            </div>
          </div>
        `;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
