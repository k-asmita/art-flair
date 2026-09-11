"""
Art Flair - Cart Database & Product Image Integration Test (Test Client)
Tests the full lifecycle of database-driven cart with physical product image serving.
"""

import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

app = create_app()
client = app.test_client()


def test_cart_workflow():
    print("=" * 80)
    print("  ART FLAIR - CART DATABASE & PRODUCT IMAGE VERIFICATION")
    print("=" * 80)

    # 1. Login Patron User (USR001)
    login_res = client.post("/api/auth/login", json={
        "email": "artist.patron@studio.com",
        "password": "masterpiece2026"
    })
    assert login_res.status_code == 200, "Patron login failed"
    data = login_res.get_json()
    token = data.get("token")
    user = data.get("user")
    headers = {"Authorization": f"Bearer {token}"}
    print(f"\n[1] Patron Logged In: {user['first_name']} {user['last_name']} (ID: {user['user_id']})")

    # 2. Clear Initial Cart
    client.post("/api/cart/clear", json={}, headers=headers)
    print("[2] Initial Cart Cleared in Database.")

    # 3. Add Products from distinct categories to Cart in MySQL
    test_items = [
        ("PRO001", "Clay Tools", 2),
        ("PRO013", "Detailing Set", 1),
        ("PRO049", "Acrylic Paint", 3)
    ]

    for pid, name, qty in test_items:
        res = client.post("/api/cart/add", json={"productId": pid, "quantity": qty}, headers=headers)
        assert res.status_code == 200 and res.get_json().get("success"), f"Failed to add {name} ({pid})"
        print(f"[3] Added to MySQL Cart: {qty}x '{name}' (ID: {pid})")

    # 4. Fetch Active Database Cart
    cart_res = client.get("/api/cart", headers=headers)
    assert cart_res.status_code == 200
    cart_data = cart_res.get_json()
    items = cart_data.get("items", [])
    summary = cart_data.get("summary", {})

    print(f"\n[4] Active Database Cart Retrieved:")
    print(f"    Total Distinct Items : {len(items)}")
    print(f"    Total Quantity Count : {summary.get('itemCount')}")
    print(f"    Subtotal             : INR {summary.get('subtotal')}")
    print(f"    Shipping Fee         : INR {summary.get('shipping')}")
    print(f"    GST (12%)            : INR {summary.get('tax')}")
    print(f"    Grand Total          : INR {summary.get('total')}")

    # 5. Verify Each Cart Item and its Product Image Endpoint
    print(f"\n[5] Verifying Cart Products & Image Endpoints:")
    for item in items:
        pid = item.get("productId") or item.get("product_id")
        name = item.get("name") or item.get("product_name")
        qty = item.get("quantity")
        price = item.get("price")
        sub = item.get("subtotal")
        img_endpoint = item.get("image") or item.get("image_url")

        print(f"\n    Item: '{name}' (ID: {pid})")
        print(f"      Quantity : {qty} @ INR {price} = INR {sub}")
        print(f"      Image URL: {img_endpoint}")

        # Test Image Endpoint
        img_res = client.get(img_endpoint)
        print(f"      Image Endpoint HTTP Status : {img_res.status_code} OK")
        print(f"      Image Content-Type         : {img_res.content_type}")
        print(f"      Image Payload Size         : {len(img_res.data)} bytes")
        assert img_res.status_code == 200, f"Image request failed for {name}"
        assert len(img_res.data) > 0, f"Empty image data for {name}"

    # 6. Update Cart Item Quantity in Database
    first_item = items[0]
    update_res = client.put(f"/api/cart/items/{first_item['cartItemId']}", json={"quantity": 5}, headers=headers)
    assert update_res.status_code == 200 and update_res.get_json().get("success")
    print(f"\n[6] Updated '{first_item['name']}' quantity to 5 in MySQL database.")

    # 7. Remove an Item from Cart in Database
    second_item = items[1]
    remove_res = client.delete(f"/api/cart/items/{second_item['cartItemId']}", headers=headers)
    assert remove_res.status_code == 200 and remove_res.get_json().get("success")
    print(f"[7] Removed '{second_item['name']}' from MySQL database cart.")

    print("\n" + "=" * 80)
    print("  [SUCCESS] DATABASE-DRIVEN CART & PRODUCT IMAGES VERIFIED WITH 100% SUCCESS!")
    print("=" * 80)


if __name__ == "__main__":
    test_cart_workflow()
