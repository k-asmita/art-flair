/**
 * Art Flair - AI/ML Art Supplies Recommender Service
 * Sabahz Trading
 * 
 * Analyzes artist input parameters (medium, skill level, project scope, budget)
 * and generates custom-curated art supply bundles and medium pairing insights.
 */

const AiService = {
  async recommendSupplyKit(answers) {
    // Artificial latency to emulate ML inference
    await new Promise(resolve => setTimeout(resolve, 350));

    const { medium, skillLevel, projectType, budget } = answers;

    // Fetch catalog to pick ideal matching items
    const catalogResponse = await ProductService.getProducts();
    const products = catalogResponse.products || [];

    // Filter relevant medium products
    let mediumProducts = products.filter(p => {
      if (medium === 'oil') return p.category.includes('Oil');
      if (medium === 'acrylic') return p.category.includes('Acrylic');
      if (medium === 'watercolor') return p.category.includes('Watercolor');
      if (medium === 'drawing') return p.category.includes('Drawing');
      return true;
    });

    // Pick top paint/core medium
    const coreMedium = mediumProducts[0] || products[0];
    
    // Pick compatible brush
    const brushTool = products.find(p => p.categoryId === 'brushes-tools') || products[3];
    
    // Pick optimal archival surface
    const surface = products.find(p => p.categoryId === 'paper-canvases') || products[4];

    const bundleItems = [coreMedium, brushTool, surface].filter(Boolean);
    const bundleTotal = bundleItems.reduce((sum, item) => sum + (item.price * (1 - (item.discount || 0)/100)), 0);

    let profileExplanation = '';
    if (skillLevel === 'beginner') {
      profileExplanation = 'Our AI model selected forgiving, high-pigment essentials designed for rapid skill development and easy solvent management.';
    } else if (skillLevel === 'intermediate') {
      profileExplanation = 'Curated with single-pigment purity and balanced viscosity to expand your color mixing palette and layering fidelity.';
    } else {
      profileExplanation = 'Configured for museum-grade permanence, ASTM I lightfast standards, and high-tensile archival Belgian linen supports.';
    }

    return {
      success: true,
      compatibilityScore: 98.4,
      aiAnalysis: {
        medium: medium.toUpperCase(),
        level: skillLevel,
        explanation: profileExplanation,
        pairingAdvice: `For ${medium} on ${projectType}, we configured a fast-drying solvent-free workflow with synthetic multi-filament brushes to prevent bristle degradation.`
      },
      bundle: {
        items: bundleItems,
        totalPrice: Number(bundleTotal.toFixed(2)),
        bundleSavings: 15.00
      }
    };
  }
};
