"""
Art Flair - Review Service Layer
Bound strictly to actual MySQL 'reviews', 'users', and 'products' tables in 'art_flair'.
"""

from database.connection import fetch_all, fetch_one, execute_query
from utils.id_generator import generate_custom_id
import logging

logger = logging.getLogger(__name__)


class ReviewService:
    """Product reviews and ratings management."""

    @staticmethod
    def get_product_reviews(product_id):
        sql = """
            SELECT r.review_id, r.user_id, r.product_id, r.rating, r.review_text, r.created_at,
                   u.first_name, u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = %s
            ORDER BY r.created_at DESC;
        """
        rows = fetch_all(sql, (product_id,))
        reviews = []
        for r in rows:
            reviews.append({
                "review_id": r['review_id'],
                "user_id": r['user_id'],
                "product_id": r['product_id'],
                "rating": int(r['rating']),
                "review_text": r['review_text'],
                "author": f"{r['first_name']} {r['last_name'] or ''}".strip(),
                "created_at": r['created_at'].isoformat() if hasattr(r['created_at'], 'isoformat') else str(r['created_at'])
            })
        return reviews

    @staticmethod
    def add_review(user_id, product_id, rating, review_text):
        if not user_id:
            return None, "Authentication required to submit reviews."

        if not product_id or rating is None:
            return None, "Product ID and rating (1-5) are required."

        rating = max(1, min(5, int(rating)))

        # Check if user already reviewed
        existing = fetch_one("SELECT review_id FROM reviews WHERE user_id = %s AND product_id = %s;", (user_id, product_id))
        if existing:
            execute_query("""
                UPDATE reviews SET rating = %s, review_text = %s WHERE review_id = %s;
            """, (rating, review_text, existing['review_id']))
            review_id = existing['review_id']
        else:
            review_id = generate_custom_id('REV', 'reviews', 'review_id')
            execute_query("""
                INSERT INTO reviews (review_id, user_id, product_id, rating, review_text)
                VALUES (%s, %s, %s, %s, %s);
            """, (review_id, user_id, product_id, rating, review_text))

        return {"review_id": review_id, "rating": rating, "message": "Review submitted successfully."}, None
