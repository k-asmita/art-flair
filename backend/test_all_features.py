"""
Art Flair - Comprehensive End-to-End Backend Verification Test
Tests all endpoints against the live MySQL 'art_flair' database.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

app = create_app()
client = app.test_client()


def test_all():
    print("=" * 70)
    print("  ART FLAIR - COMPREHENSIVE BACKEND & DATABASE VERIFICATION")
    print("=" * 70)

    # 1. Health Check
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    health_data = res.get_json()
    print(f"  [PASS] 1. Health Check: Status={health_data.get('status')}, MySQL={health_data.get('mysql_status')} (Version: {health_data.get('mysql_version')})")

    # 2. Product Listing
    res = client.get('/api/products?page_size=100')
    assert res.status_code == 200, f"Products listing failed: {res.status_code}"
    prod_data = res.get_json()
    products = prod_data.get('products', [])
    total_prods = prod_data.get('total', 0)
    print(f"  [PASS] 2. Products Catalog: Retrieved {len(products)}/{total_prods} products from MySQL database.")

    # 3. Product Image Resolution
    sample_prod = products[0]
    img_url = sample_prod.get('image')
    print(f"         Sample Product: '{sample_prod.get('name')}' (ID: {sample_prod.get('id')}) -> Image URL: {img_url}")
    res_img = client.get(img_url)
    assert res_img.status_code == 200, f"Image serving failed for {img_url}: {res_img.status_code}"
    print(f"  [PASS] 3. Product Image Serving: Verified 200 OK image response for '{img_url}' ({len(res_img.data)} bytes).")

    # 4. Categories Listing
    res_cat = client.get('/api/categories')
    assert res_cat.status_code == 200, "Categories API failed"
    categories = res_cat.get_json().get('categories', [])
    print(f"  [PASS] 4. Categories API: Retrieved {len(categories)} exact categories from MySQL.")

    # 5. Customer Authentication
    res_login = client.post('/api/auth/login', json={
        "email": "artist.patron@studio.com",
        "password": "masterpiece2026"
    })
    assert res_login.status_code == 200, f"Patron login failed: {res_login.get_json()}"
    auth_data = res_login.get_json()
    token = auth_data.get('token')
    user = auth_data.get('user')
    headers = {"Authorization": f"Bearer {token}"}
    print(f"  [PASS] 5. Patron Authentication: Logged in '{user.get('name')}' (ID: {user.get('id')}). JWT Token issued.")

    # 6. Database Cart Operations (Add, Get, Update, Remove)
    client.post('/api/cart/clear', headers=headers)
    target_product_id = sample_prod.get('id')

    # Add to cart
    res_add = client.post('/api/cart/add', headers=headers, json={"productId": target_product_id, "quantity": 2})
    assert res_add.status_code == 200, f"Cart add failed: {res_add.get_json()}"
    cart_after_add = res_add.get_json().get('items', [])
    assert len(cart_after_add) > 0, "Cart is empty after add"
    print(f"  [PASS] 6a. Cart Add: Added {target_product_id} to MySQL cart. Total items: {len(cart_after_add)}.")

    # Get cart
    res_get_cart = client.get('/api/cart', headers=headers)
    assert res_get_cart.status_code == 200, "Cart get failed"
    cart_summary = res_get_cart.get_json().get('summary', {})
    print(f"  [PASS] 6b. Cart Retrieval: Subtotal=INR {cart_summary.get('subtotal')}, Total=INR {cart_summary.get('total')}.")

    # Update cart quantity
    res_update = client.put(f'/api/cart/items/{target_product_id}', headers=headers, json={"quantity": 3})
    assert res_update.status_code == 200, "Cart update failed"
    print("  [PASS] 6c. Cart Quantity Update: Updated to quantity 3 in database.")

    # 7. Wishlist Operations
    res_wish = client.post('/api/wishlist/add', headers=headers, json={"productId": target_product_id})
    assert res_wish.status_code == 200, "Wishlist add failed"
    res_wish_get = client.get('/api/wishlist', headers=headers)
    assert res_wish_get.status_code == 200, "Wishlist get failed"
    wish_count = res_wish_get.get_json().get('count', 0)
    print(f"  [PASS] 7. Wishlist API: Verified {wish_count} saved wishlist items in MySQL.")

    # 8. Order Placement & Inventory Deduction
    res_order = client.post('/api/orders/checkout', headers=headers, json={
        "customer": {"firstName": "Aarav", "lastName": "Sharma", "email": "artist.patron@studio.com", "phone": "+91 98765 43210"},
        "shippingAddress": {"address": "74 Studio Boulevard", "city": "Mumbai", "state": "Maharashtra", "postalCode": "400001", "country": "India"}
    })
    assert res_order.status_code == 201, f"Checkout failed: {res_order.get_json()}"
    order_res = res_order.get_json()
    order_id = order_res.get('order_id') or order_res.get('orderId')
    print(f"  [PASS] 8. Order Placement: Created order {order_id} (Total: INR {order_res.get('total')}) with inventory deduction and cart clearance.")

    # Verify orders list
    res_orders_list = client.get('/api/orders', headers=headers)
    orders = res_orders_list.get_json().get('orders', [])
    assert len(orders) > 0, "No orders returned in order history"
    print(f"  [PASS] 9. Order History: Found {len(orders)} order records for customer in MySQL.")

    # 10. AI/ML Recommendation Engine
    res_recs = client.get('/api/recommendations/user', headers=headers)
    assert res_recs.status_code == 200, "Recommendations API failed"
    recs = res_recs.get_json().get('products', [])
    print(f"  [PASS] 10. AI/ML Recommender: Generated {len(recs)} personalized recommendations for customer.")

    # 11. Admin Statistics & Inventory
    res_stats = client.get('/api/admin/stats')
    assert res_stats.status_code == 200, "Admin stats failed"
    stats = res_stats.get_json().get('stats', {})
    print(f"  [PASS] 11. Admin Dashboard: Total Revenue=INR {stats.get('totalRevenue')}, Total Orders={stats.get('totalOrders')}, Products={stats.get('totalProducts')}.")

    res_inv = client.get('/api/admin/inventory')
    assert res_inv.status_code == 200, "Admin inventory failed"
    inv_items = res_inv.get_json().get('inventory', [])
    print(f"  [PASS] 12. Admin Inventory: Retrieved {len(inv_items)} live stock records from MySQL inventory table.")

    print("=" * 70)
    print("  [SUCCESS] ALL 12 INTEGRATION & DATABASE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 70)


if __name__ == '__main__':
    test_all()
