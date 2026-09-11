"""
Art Flair - AI/ML Recommendation Engine
Uses Scikit-learn (TfidfVectorizer, Cosine Similarity), Pandas, and NumPy.
Trains dynamically on catalog features and customer_interactions.
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database.connection import fetch_all
from utils.image_utils import resolve_product_image_url
import logging

logger = logging.getLogger(__name__)


class RecommendationModel:
    """Hybrid recommendation engine using TF-IDF content filtering and interaction weighting."""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.similarity_matrix = None
        self.products_df = pd.DataFrame()
        self.is_trained = False

    def train_model(self):
        """Fetches active products from MySQL 'products' and builds similarity matrix."""
        sql = """
            SELECT p.product_id, p.category_id, p.product_name, p.description, p.price,
                   p.product_image, p.brand, c.category_name,
                   COALESCE(i.quantity, 0) AS stock,
                   COALESCE(r.avg_rating, 5.0) AS rating,
                   COALESCE(r.review_count, 0) AS reviews_count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            LEFT JOIN (
                SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
                FROM reviews
                GROUP BY product_id
            ) r ON p.product_id = r.product_id
            WHERE p.is_available = 1;
        """
        rows = fetch_all(sql)
        if not rows:
            logger.warning("[AI/ML Recommender] No products found in database for training.")
            return

        try:
            self.products_df = pd.DataFrame(rows)
            # Combine textual features
            self.products_df['combined_features'] = (
                self.products_df['product_name'].fillna('') + ' ' +
                self.products_df['category_name'].fillna('') + ' ' +
                self.products_df['brand'].fillna('') + ' ' +
                self.products_df['description'].fillna('')
            )

            tfidf_matrix = self.vectorizer.fit_transform(self.products_df['combined_features'])
            self.similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
            self.is_trained = True
            logger.info(f"[AI/ML Recommender] Successfully trained on {len(self.products_df)} products from art_flair.")
        except Exception as e:
            logger.error(f"[AI/ML Recommender] Training error: {e}")

    def get_recommendations_for_user(self, user_id=None, top_n=6):
        """
        Returns personalized product recommendations based on customer_interactions.
        Interaction weights: purchase (5.0), cart (3.0), wishlist (2.5), view (1.0).
        """
        if not self.is_trained or self.products_df.empty:
            self.train_model()

        if self.products_df.empty:
            return []

        interactions = []
        if user_id:
            interactions = fetch_all("""
                SELECT product_id, interaction_type,
                       CASE interaction_type
                           WHEN 'purchase' THEN 5.0
                           WHEN 'cart' THEN 3.0
                           WHEN 'wishlist' THEN 2.5
                           WHEN 'view' THEN 1.0
                           ELSE 1.0
                       END AS weight
                FROM customer_interactions
                WHERE user_id = %s AND product_id IS NOT NULL;
            """, (user_id,))

        if not interactions:
            # Fallback strategy: Highest rated / popular inventory items
            sorted_df = self.products_df.sort_values(by=['rating', 'reviews_count', 'stock'], ascending=[False, False, False])
            top_records = sorted_df.head(top_n).to_dict('records')
            return [self._format_rec(r) for r in top_records]

        try:
            user_scores = np.zeros(len(self.products_df))
            interacted_ids = set()

            for it in interactions:
                pid = it.get('product_id')
                weight = float(it.get('weight', 1.0))
                interacted_ids.add(pid)

                matches = self.products_df.index[self.products_df['product_id'] == pid].tolist()
                if matches:
                    idx = matches[0]
                    user_scores += self.similarity_matrix[idx] * weight

            ranked_indices = np.argsort(user_scores)[::-1]
            recommendations = []

            for idx in ranked_indices:
                row = self.products_df.iloc[idx]
                if row['product_id'] not in interacted_ids:
                    recommendations.append(self._format_rec(row.to_dict()))
                if len(recommendations) >= top_n:
                    break

            if len(recommendations) < top_n:
                for idx in ranked_indices:
                    row = self.products_df.iloc[idx]
                    if self._format_rec(row.to_dict()) not in recommendations:
                        recommendations.append(self._format_rec(row.to_dict()))
                    if len(recommendations) >= top_n:
                        break

            return recommendations
        except Exception as e:
            logger.error(f"[AI/ML Recommender] Prediction error: {e}")
            return [self._format_rec(r) for r in self.products_df.head(top_n).to_dict('records')]

    def get_recommendations_for_product(self, product_id, top_n=4):
        """Returns companion products with highest cosine similarity."""
        if not self.is_trained or self.products_df.empty:
            self.train_model()

        if self.products_df.empty:
            return []

        try:
            matches = self.products_df.index[self.products_df['product_id'] == product_id].tolist()
            if not matches:
                return [self._format_rec(r) for r in self.products_df.head(top_n).to_dict('records')]

            idx = matches[0]
            sim_scores = list(enumerate(self.similarity_matrix[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

            sim_scores = [s for s in sim_scores if s[0] != idx][:top_n]
            indices = [s[0] for s in sim_scores]

            recs = self.products_df.iloc[indices].to_dict('records')
            return [self._format_rec(r) for r in recs]
        except Exception as e:
            logger.error(f"[AI/ML Recommender] Product pairings error: {e}")
            return []

    def _format_rec(self, r):
        cat_name = r.get('category_name') or 'Fine Art'
        img_name = r.get('product_image')
        return {
            "id": r['product_id'],
            "product_id": r['product_id'],
            "name": r['product_name'],
            "product_name": r['product_name'],
            "category": cat_name,
            "category_name": cat_name,
            "brand": r.get('brand') or 'Artisan Atelier',
            "price": float(r['price']),
            "stock": int(r.get('stock', 0)),
            "rating": round(float(r.get('rating', 5.0)), 1),
            "reviewsCount": int(r.get('reviews_count', 0)),
            "image": resolve_product_image_url(cat_name, img_name),
            "product_image": img_name,
            "description": r.get('description')
        }


# Singleton model instance
recommendation_engine = RecommendationModel()
