"""
Art Flair - Order Service Layer
Manages checkout, authoritative MySQL pricing, inventory deduction, order creation,
and transaction rollback using actual 'orders', 'order_items', 'inventory', and 'cart' tables.
"""

from database.connection import get_db, fetch_all, fetch_one
from utils.image_utils import get_product_image_endpoint_url, resolve_product_image_url
from utils.id_generator import generate_custom_id
from config import Config
import logging

logger = logging.getLogger(__name__)


class OrderService:
    """Order validation, checkout execution, and patron order tracking."""

    @staticmethod
    def create_order(user_id, data):
        if not user_id:
            return None, "Authenticated customer session required."

        # Customer & Shipping details
        customer = data.get('customer', {})
        shipping = data.get('shippingAddress', {})
        address_text = data.get('shipping_address')

        if not address_text:
            parts = [
                shipping.get('address', ''),
                shipping.get('city', ''),
                shipping.get('state', ''),
                shipping.get('postalCode', ''),
                shipping.get('country', 'India')
            ]
            address_text = ", ".join([p for p in parts if p]).strip()

        if not address_text:
            address_text = "Standard Atelier Studio Address, India"

        # Fetch current user cart items from MySQL database
        cart_sql = """
            SELECT c.cart_id, c.product_id, c.quantity, p.product_name, p.price, p.is_available,
                   COALESCE(i.quantity, 0) AS stock, cat.category_name, p.product_image
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            JOIN categories cat ON p.category_id = cat.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE c.user_id = %s;
        """
        cart_rows = fetch_all(cart_sql, (user_id,))

        if not cart_rows:
            return None, "Your studio cart is empty. Add materials before checking out."

        order_id = generate_custom_id('ORD', 'orders', 'order_id')

        with get_db() as cur:
            # 1. Authoritative Price & Inventory Validation
            subtotal = 0.0
            order_items_to_insert = []

            for item in cart_rows:
                req_qty = int(item['quantity'])
                unit_price = float(item['price'])
                item_subtotal = round(unit_price * req_qty, 2)
                subtotal += item_subtotal

                available_stock = int(item['stock'])
                if available_stock < req_qty:
                    return None, f"Insufficient stock for '{item['product_name']}'. Only {available_stock} units available."

                item_id = generate_custom_id('ORI', 'order_items', 'order_item_id')
                order_items_to_insert.append({
                    "order_item_id": item_id,
                    "order_id": order_id,
                    "product_id": item['product_id'],
                    "quantity": req_qty,
                    "price": unit_price,
                    "subtotal": item_subtotal
                })

            # 2. Authoritative Total Calculation in INR
            free_threshold = Config.FREE_SHIPPING_THRESHOLD
            shipping_fee = 0.0 if subtotal >= free_threshold else 150.0
            tax_amount = round(subtotal * Config.TAX_RATE, 2)
            grand_total = round(subtotal + shipping_fee + tax_amount, 2)

            # 3. Insert Order Record
            cur.execute("""
                INSERT INTO orders (order_id, user_id, total_amount, order_status, shipping_address)
                VALUES (%s, %s, %s, 'pending', %s);
            """, (order_id, user_id, grand_total, address_text))

            # 4. Insert Order Items & Deduct Inventory
            for oi in order_items_to_insert:
                cur.execute("""
                    INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price, subtotal)
                    VALUES (%s, %s, %s, %s, %s, %s);
                """, (
                    oi['order_item_id'],
                    oi['order_id'],
                    oi['product_id'],
                    oi['quantity'],
                    oi['price'],
                    oi['subtotal']
                ))

                cur.execute("""
                    UPDATE inventory SET quantity = GREATEST(0, quantity - %s)
                    WHERE product_id = %s;
                """, (oi['quantity'], oi['product_id']))

                # Record purchase interaction for AI/ML
                try:
                    int_id = generate_custom_id('INT', 'customer_interactions', 'interaction_id')
                    cur.execute("""
                        INSERT INTO customer_interactions (interaction_id, user_id, product_id, interaction_type)
                        VALUES (%s, %s, %s, 'purchase');
                    """, (int_id, user_id, oi['product_id']))
                except Exception:
                    pass

            # 5. Clear MySQL Cart
            cur.execute("DELETE FROM cart WHERE user_id = %s;", (user_id,))

        return {
            "orderId": order_id,
            "order_id": order_id,
            "total": grand_total,
            "total_amount": grand_total,
            "status": "pending",
            "order_status": "pending",
            "message": "Order placed and verified successfully against MySQL inventory."
        }, None

    @staticmethod
    def get_user_orders(user_id):
        if not user_id:
            return []

        orders_sql = """
            SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.order_status, o.shipping_address
            FROM orders o
            WHERE o.user_id = %s
            ORDER BY o.order_date DESC;
        """
        order_rows = fetch_all(orders_sql, (user_id,))
        results = []

        for o in order_rows:
            items_sql = """
                SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.price, oi.subtotal,
                       p.product_name, p.product_image, cat.category_name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                JOIN categories cat ON p.category_id = cat.category_id
                WHERE oi.order_id = %s;
            """
            items_rows = fetch_all(items_sql, (o['order_id'],))

            formatted_items = []
            for it in items_rows:
                img_url = get_product_image_endpoint_url(it['product_id'])
                formatted_items.append({
                    "id": it['product_id'],
                    "product_id": it['product_id'],
                    "name": it['product_name'],
                    "product_name": it['product_name'],
                    "quantity": int(it['quantity']),
                    "price": float(it['price']),
                    "subtotal": float(it['subtotal']),
                    "image": img_url,
                    "image_url": img_url,
                    "product_image": it['product_image']
                })

            results.append({
                "orderId": o['order_id'],
                "order_id": o['order_id'],
                "orderDate": o['order_date'].isoformat() if hasattr(o['order_date'], 'isoformat') else str(o['order_date']),
                "total": float(o['total_amount']),
                "total_amount": float(o['total_amount']),
                "status": o['order_status'].capitalize() if o['order_status'] else 'Pending',
                "order_status": o['order_status'],
                "paymentStatus": "Paid",
                "shippingAddress": {"address": o['shipping_address']},
                "shipping_address": o['shipping_address'],
                "items": formatted_items
            })

        return results
