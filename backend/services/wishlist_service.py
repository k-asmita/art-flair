"""
Art Flair - Wishlist Service Layer
Bound strictly to actual MySQL 'wishlist' table in 'art_flair' database.
"""

from database.connection import fetch_all, fetch_one, execute_query
from utils.image_utils import get_product_image_endpoint_url, resolve_product_image_url
from utils.id_generator import generate_custom_id
import logging

logger = logging.getLogger(__name__)


class WishlistService:
    """Customer wishlist database management."""

    @staticmethod
    def get_wishlist(user_id):
        if not user_id:
            return {"count": 0, "items": []}

        sql = """
            SELECT 
                w.wishlist_id, w.user_id, w.product_id, w.added_at,
                p.product_name, p.price, p.product_image, p.brand, p.is_available,
                c.category_name,
                COALESCE(i.quantity, 0) AS stock
            FROM wishlist w
            JOIN products p ON w.product_id = p.product_id
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE w.user_id = %s
            ORDER BY w.added_at DESC;
        """
        rows = fetch_all(sql, (user_id,))
        items = []

        for r in rows:
            img_url = get_product_image_endpoint_url(r['product_id'])
            items.append({
                "wishlist_id": r['wishlist_id'],
                "id": r['product_id'],
                "product_id": r['product_id'],
                "productId": r['product_id'],
                "name": r['product_name'],
                "product_name": r['product_name'],
                "category": r['category_name'],
                "category_name": r['category_name'],
                "brand": r.get('brand') or 'Artisan Atelier',
                "price": float(r['price']),
                "stock": int(r['stock']),
                "image": img_url,
                "image_url": img_url,
                "product_image": r['product_image'],
                "isAvailable": bool(r['is_available']),
                "addedDate": r['added_at'].isoformat() if hasattr(r['added_at'], 'isoformat') else str(r['added_at'])
            })

        return {"count": len(items), "items": items}

    @staticmethod
    def add_to_wishlist(user_id, product_id):
        if not user_id:
            return None, "Authenticated customer session required."

        existing = fetch_one("SELECT wishlist_id FROM wishlist WHERE user_id = %s AND product_id = %s;", (user_id, product_id))
        if not existing:
            w_id = generate_custom_id('WSH', 'wishlist', 'wishlist_id')
            execute_query("""
                INSERT INTO wishlist (wishlist_id, user_id, product_id)
                VALUES (%s, %s, %s);
            """, (w_id, user_id, product_id))

            # Record customer interaction
            try:
                int_id = generate_custom_id('INT', 'customer_interactions', 'interaction_id')
                execute_query("""
                    INSERT INTO customer_interactions (interaction_id, user_id, product_id, interaction_type)
                    VALUES (%s, %s, %s, 'wishlist');
                """, (int_id, user_id, product_id))
            except Exception:
                pass

        return WishlistService.get_wishlist(user_id), None

    @staticmethod
    def remove_from_wishlist(user_id, item_or_product_id):
        if not user_id:
            return None, "Authenticated customer session required."

        execute_query("""
            DELETE FROM wishlist WHERE user_id = %s AND (wishlist_id = %s OR product_id = %s);
        """, (user_id, item_or_product_id, item_or_product_id))

        return WishlistService.get_wishlist(user_id), None
