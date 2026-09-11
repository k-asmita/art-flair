"""
Art Flair - Cart Service Layer
Database-driven shopping cart using actual MySQL 'cart', 'products', 'categories', and 'inventory' tables.
"""

from database.connection import fetch_all, fetch_one, execute_query
from utils.image_utils import get_product_image_endpoint_url, resolve_product_image_url
from utils.id_generator import generate_custom_id
from config import Config
import logging

logger = logging.getLogger(__name__)


class CartService:
    """Shopping cart management strictly bound to the MySQL 'cart' table."""

    @staticmethod
    def get_cart(user_id):
        if not user_id:
            return {"items": [], "summary": CartService._empty_summary()}

        sql = """
            SELECT 
                c.cart_id, c.user_id, c.product_id, c.quantity, c.added_at,
                p.product_name, p.price, p.product_image, p.brand, p.is_available,
                cat.category_name,
                COALESCE(i.quantity, 0) AS stock
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            LEFT JOIN categories cat ON p.category_id = cat.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE c.user_id = %s
            ORDER BY c.added_at DESC;
        """
        rows = fetch_all(sql, (user_id,))
        items = []
        subtotal = 0.0

        for r in rows:
            unit_price = float(r['price'])
            qty = int(r['quantity'])
            item_subtotal = round(unit_price * qty, 2)
            subtotal += item_subtotal

            raw_img = str(r.get('product_image') or '').lstrip('/')
            static_image_url = f"/static/images/{raw_img}"

            items.append({
                "cart_id": r['cart_id'],
                "cartItemId": r['cart_id'],
                "product_id": r['product_id'],
                "productId": r['product_id'],
                "id": r['product_id'],
                "product_name": r['product_name'],
                "name": r['product_name'],
                "brand": r.get('brand') or 'Artisan Atelier',
                "category_name": r['category_name'],
                "category": r['category_name'],
                "price": unit_price,
                "quantity": qty,
                "subtotal": item_subtotal,
                "stock": int(r['stock']),
                "product_image": r['product_image'],
                "image": static_image_url,
                "image_url": static_image_url,
                "is_available": bool(r['is_available'])
            })

        # Calculate authoritative summary
        free_threshold = Config.FREE_SHIPPING_THRESHOLD
        shipping = 0.0 if (subtotal >= free_threshold or len(items) == 0) else 150.0
        tax = round(subtotal * Config.TAX_RATE, 2)
        total = round(subtotal + shipping + tax, 2)
        remaining_free = max(0.0, free_threshold - subtotal)

        summary = {
            "itemCount": sum(i['quantity'] for i in items),
            "subtotal": round(subtotal, 2),
            "discount": 0.0,
            "shipping": round(shipping, 2),
            "tax": tax,
            "total": total,
            "freeShippingThreshold": free_threshold,
            "remainingForFreeShipping": round(remaining_free, 2)
        }

        return {"items": items, "summary": summary}

    @staticmethod
    def add_to_cart(user_id, product_id, quantity=1):
        if not user_id:
            return None, "Authenticated customer session required."

        if quantity <= 0:
            quantity = 1

        # Check product existence and inventory availability
        product = fetch_one("""
            SELECT p.product_id, p.product_name, p.price, p.is_available, COALESCE(i.quantity, 0) AS stock
            FROM products p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE p.product_id = %s;
        """, (product_id,))

        if not product:
            return None, f"Product '{product_id}' not found in database."

        if not product['is_available']:
            return None, f"'{product['product_name']}' is currently not available."

        available_stock = int(product['stock'])

        # Check if already in cart
        existing = fetch_one("SELECT cart_id, quantity FROM cart WHERE user_id = %s AND product_id = %s;", (user_id, product_id))

        if existing:
            new_qty = existing['quantity'] + quantity
            if new_qty > available_stock:
                return None, f"Cannot add {quantity} more. Total requested ({new_qty}) exceeds available stock ({available_stock})."
            execute_query("UPDATE cart SET quantity = %s WHERE cart_id = %s;", (new_qty, existing['cart_id']))
        else:
            if quantity > available_stock:
                return None, f"Requested quantity ({quantity}) exceeds available stock ({available_stock})."
            cart_id = generate_custom_id('CRT', 'cart', 'cart_id')
            execute_query("""
                INSERT INTO cart (cart_id, user_id, product_id, quantity)
                VALUES (%s, %s, %s, %s);
            """, (cart_id, user_id, product_id, quantity))

        # Log customer interaction
        try:
            int_id = generate_custom_id('INT', 'customer_interactions', 'interaction_id')
            execute_query("""
                INSERT INTO customer_interactions (interaction_id, user_id, product_id, interaction_type)
                VALUES (%s, %s, %s, 'cart');
            """, (int_id, user_id, product_id))
        except Exception:
            pass

        return CartService.get_cart(user_id), None

    @staticmethod
    def update_cart_item(user_id, item_or_product_id, quantity):
        if not user_id:
            return None, "Authenticated customer session required."

        if quantity <= 0:
            return CartService.remove_cart_item(user_id, item_or_product_id)

        # Find cart item
        cart_item = fetch_one("""
            SELECT c.cart_id, c.product_id, p.product_name, COALESCE(i.quantity, 0) AS stock
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE c.user_id = %s AND (c.cart_id = %s OR c.product_id = %s);
        """, (user_id, item_or_product_id, item_or_product_id))

        if not cart_item:
            return None, "Cart item not found."

        stock = int(cart_item['stock'])
        if quantity > stock:
            return None, f"Insufficient stock for '{cart_item['product_name']}'. Only {stock} units available."

        execute_query("UPDATE cart SET quantity = %s WHERE cart_id = %s;", (quantity, cart_item['cart_id']))
        return CartService.get_cart(user_id), None

    @staticmethod
    def remove_cart_item(user_id, item_or_product_id):
        if not user_id:
            return None, "Authenticated customer session required."

        execute_query("""
            DELETE FROM cart WHERE user_id = %s AND (cart_id = %s OR product_id = %s);
        """, (user_id, item_or_product_id, item_or_product_id))

        return CartService.get_cart(user_id), None

    @staticmethod
    def clear_cart(user_id):
        if not user_id:
            return None, "Authenticated customer session required."

        execute_query("DELETE FROM cart WHERE user_id = %s;", (user_id,))
        return CartService.get_cart(user_id), None

    @staticmethod
    def _empty_summary():
        return {
            "itemCount": 0,
            "subtotal": 0.0,
            "discount": 0.0,
            "shipping": 0.0,
            "tax": 0.0,
            "total": 0.0,
            "freeShippingThreshold": Config.FREE_SHIPPING_THRESHOLD,
            "remainingForFreeShipping": Config.FREE_SHIPPING_THRESHOLD
        }
