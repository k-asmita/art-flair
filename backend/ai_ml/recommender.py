import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)


class ArtSupplyRecommender:
    """
    Content-Based & Collaborative Hybrid Recommendation Engine for Art Flair.
    Uses TF-IDF Vectorization, Cosine Similarity, and User Interaction Weights.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.similarity_matrix = None
        self.products_df = pd.DataFrame()
        self.is_trained = False

    def fit(self, products_list):
        """
        Fits the TF-IDF model on products catalog features:
        Name, Category, Brand, AI Tags, Specifications, and Descriptions.
        """
        if not products_list or len(products_list) == 0:
            logger.warning("[AI Recommender] No products provided for training.")
            return

        try:
            self.products_df = pd.DataFrame(products_list)

            # Combine textual features into a dense representation
            self.products_df['combined_features'] = (
                self.products_df['name'].fillna('') + ' ' +
                self.products_df['category'].fillna('') + ' ' +
                self.products_df['brand'].fillna('') + ' ' +
                self.products_df['ai_tag'].fillna('') + ' ' +
                self.products_df['description'].fillna('')
            )

            tfidf_matrix = self.vectorizer.fit_transform(self.products_df['combined_features'])
            self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
            self.is_trained = True
            logger.info(f"[AI Recommender] Trained on {len(self.products_df)} products.")
        except Exception as e:
            logger.error(f"[AI Recommender] Error during fit: {e}")

    def recommend_for_product(self, product_id, top_n=4):
        """
        Recommends companion art supplies & mediums for a specific product ID.
        """
        if not self.is_trained or self.products_df.empty:
            return []

        try:
            idx_list = self.products_df.index[self.products_df['id'] == product_id].tolist()
            if not idx_list:
                return []

            idx = idx_list[0]
            sim_scores = list(enumerate(self.similarity_matrix[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

            # Exclude self, take top N
            sim_scores = [s for s in sim_scores if s[0] != idx][:top_n]
            product_indices = [s[0] for s in sim_scores]

            recommended = self.products_df.iloc[product_indices].to_dict('records')
            return recommended
        except Exception as e:
            logger.error(f"[AI Recommender] Error in recommend_for_product: {e}")
            return []

    def recommend_for_user(self, user_interactions, top_n=6, default_products=None):
        """
        Generates personalized recommendations for a patron based on their weighted interaction history.
        Interaction weights: purchase (5.0), cart (3.0), wishlist (2.5), view (1.0).
        """
        if not self.is_trained or self.products_df.empty:
            return (default_products or [])[:top_n]

        if not user_interactions or len(user_interactions) == 0:
            # Cold-start fallback: Top rated / featured products
            sorted_df = self.products_df.sort_values(by=['rating', 'reviews_count'], ascending=[False, False])
            return sorted_df.head(top_n).to_dict('records')

        try:
            # Initialize cumulative score vector
            user_profile_scores = np.zeros(len(self.products_df))
            interacted_product_ids = set()

            for interaction in user_interactions:
                p_id = interaction.get('product_id')
                weight = float(interaction.get('weight', 1.0))
                interacted_product_ids.add(p_id)

                matches = self.products_df.index[self.products_df['id'] == p_id].tolist()
                if matches:
                    idx = matches[0]
                    user_profile_scores += self.similarity_matrix[idx] * weight

            # Sort candidate products by composite recommendation score
            ranked_indices = np.argsort(user_profile_scores)[::-1]
            recommendations = []

            for idx in ranked_indices:
                p_id = self.products_df.iloc[idx]['id']
                if p_id not in interacted_product_ids:
                    recommendations.append(self.products_df.iloc[idx].to_dict())
                if len(recommendations) >= top_n:
                    break

            return recommendations
        except Exception as e:
            logger.error(f"[AI Recommender] Error in recommend_for_user: {e}")
            return (default_products or [])[:top_n]


# Singleton instance
recommender_engine = ArtSupplyRecommender()
