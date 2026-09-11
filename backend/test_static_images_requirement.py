"""
Art Flair - Final Dynamic MySQL Products & Static Image Verification
Tests that all 73 products from MySQL 'art_flair.products' load dynamically
with correct category-wise images using '/static/images/${product.product_image}'.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

app = create_app()
client = app.test_client()


def test_dynamic_products_and_static_images():
    print("=" * 80)
    print("  ART FLAIR - DYNAMIC MYSQL PRODUCTS & STATIC IMAGE VERIFICATION")
    print("=" * 80)

    # 1. Query /api/products
    res = client.get("/api/products?page_size=100")
    assert res.status_code == 200, "Failed to call /api/products"
    data = res.get_json()
    assert data.get("success"), "API response indicates failure"

    products = data.get("products", [])
    total = data.get("total", 0)
    print(f"\n[1] Dynamic Products Retrieved from MySQL: {len(products)} (Total: {total})")
    assert len(products) == 73, f"Expected 73 products, got {len(products)}"

    # 2. Verify Required Fields for all products
    required_fields = [
        "product_id", "category_id", "category_name", "product_name",
        "description", "price", "product_image", "brand", "is_available", "image_url"
    ]

    print(f"\n[2] Verifying Required Database Fields on all 73 products...")
    for p in products:
        for f in required_fields:
            assert f in p, f"Missing required field '{f}' in product {p.get('product_id')}"
    print("    [PASS] All 73 products contain all required schema fields from MySQL JOIN.")

    # 3. Test Static Images from Category Folders across all 73 products
    print(f"\n[3] Testing Static Image Resolution for all 73 products...")
    print("    Pattern: /static/images/${product.product_image}")

    category_samples = {}
    success_count = 0

    for p in products:
        pid = p['product_id']
        name = p['product_name']
        cat = p['category_name']
        db_img = p['product_image']
        img_url = p['image_url']

        # Expected pattern: /static/images/products/...
        expected_url = f"/static/images/{db_img.lstrip('/')}"
        assert img_url == expected_url, f"Mismatched image URL for {pid}: {img_url} != {expected_url}"

        # Make HTTP request to test client
        img_res = client.get(img_url)
        assert img_res.status_code == 200, f"Image request failed ({img_res.status_code}) for {pid} at {img_url}"
        assert len(img_res.data) > 0, f"Empty image payload for {pid}"

        if cat not in category_samples:
            category_samples[cat] = {
                "id": pid,
                "name": name,
                "category": cat,
                "db_image": db_img,
                "url": img_url,
                "status": img_res.status_code,
                "content_type": img_res.content_type,
                "size": len(img_res.data)
            }
        success_count += 1

    print(f"    [PASS] Verified {success_count}/73 product images returned HTTP 200 OK.")

    # 4. Display Breakdown across all 10 Categories
    print(f"\n[4] Category-Wise Sample Verification Across All 10 Categories:")
    print("-" * 80)
    for cat, sample in category_samples.items():
        print(f"Category: {cat:<18} | Product: {sample['id']} - {sample['name']:<20}")
        print(f"  DB Path : {sample['db_image']}")
        print(f"  URL     : {sample['url']}")
        print(f"  HTTP    : {sample['status']} OK | Content-Type: {sample['content_type']} ({sample['size']} bytes)")
        print("-" * 80)

    print("\n" + "=" * 80)
    print("  [SUCCESS] ALL 73 PRODUCTS & CATEGORY-WISE STATIC IMAGES VERIFIED 100% SUCCESS!")
    print("=" * 80)


if __name__ == "__main__":
    test_dynamic_products_and_static_images()
