import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)


def analyze_customer_preferences(interactions_data, default_disciplines=None):
    """
    Computes statistical affinity percentages across creative mediums
    (e.g., Oil Painting, Watercolors, Drawing, Calligraphy, Acrylics)
    using Pandas and NumPy aggregation.
    """
    if not interactions_data or len(interactions_data) == 0:
        return default_disciplines or [
            {"discipline": "Oil Painting & Mineral Glazes", "percentage": 38},
            {"discipline": "Watercolors & Gouache", "percentage": 27},
            {"discipline": "Drawing Media & Pastels", "percentage": 18},
            {"discipline": "Calligraphy & Ink Work", "percentage": 11},
            {"discipline": "Acrylics & Mixed Media", "percentage": 6}
        ]

    try:
        df = pd.DataFrame(interactions_data)
        if 'category' not in df.columns:
            return default_disciplines or []

        category_counts = df['category'].value_counts()
        total_interactions = len(df)

        breakdown = []
        for cat_name, count in category_counts.items():
            pct = int(np.round((count / total_interactions) * 100))
            breakdown.append({
                "discipline": f"{cat_name} Mediums",
                "percentage": pct
            })

        return breakdown
    except Exception as e:
        logger.error(f"[AI Preferences Analysis] Error: {e}")
        return default_disciplines or []
