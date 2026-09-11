"""
Art Flair - Customer Interactions Service Layer
Bound strictly to MySQL 'customer_interactions' table in 'art_flair'.
"""

from database.connection import execute_query, fetch_all
from utils.id_generator import generate_custom_id
import logging

logger = logging.getLogger(__name__)


class InteractionService:
    """Records user browsing, searching, and interactions for AI/ML modeling."""

    @staticmethod
    def record_interaction(user_id, interaction_type, product_id=None, search_query=None):
        if not user_id:
            return None

        valid_types = {'search', 'view', 'cart', 'wishlist', 'purchase'}
        if interaction_type not in valid_types:
            return None

        try:
            int_id = generate_custom_id('INT', 'customer_interactions', 'interaction_id')
            execute_query("""
                INSERT INTO customer_interactions (interaction_id, user_id, product_id, interaction_type, search_query)
                VALUES (%s, %s, %s, %s, %s);
            """, (int_id, user_id, product_id, interaction_type, search_query))
            return int_id
        except Exception as e:
            logger.warning(f"[Interaction Log] Error recording interaction: {e}")
            return None

    @staticmethod
    def get_user_interactions(user_id):
        sql = """
            SELECT ci.interaction_id, ci.user_id, ci.product_id, ci.interaction_type, ci.search_query, ci.interaction_date,
                   p.product_name, c.category_name
            FROM customer_interactions ci
            LEFT JOIN products p ON ci.product_id = p.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE ci.user_id = %s
            ORDER BY ci.interaction_date DESC;
        """
        return fetch_all(sql, (user_id,))
