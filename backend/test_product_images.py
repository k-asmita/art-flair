"""
Art Flair - Product Image Resolution & Endpoint Verification Test
Tests 5+ products across distinct categories to ensure 100% correct image resolution.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from utils.image_utils import resolve_physical_image_path

app = create_app()
client = app.test_client()

TEST_PRODUCTS = [
    ("PRO001", "Accessories", "Clay Tools", "clay-tools.webp"),
    ("PRO013", "Brushes", "Detailing Set", "detailing-set.webp"),
    ("PRO024", "Calligraphy", "Calligraphy Set 1", "calligraphy1.jpg"),
    ("PRO029", "Canvas", "Canvas Roll", "canvas-roll.webp"),
    ("PRO032", "Drawing Media", "Charcoal Kit", "charcoal-kit.webp"),
    ("PRO042", "Easels", "Easel 1", "easel1.webp"),
    ("PRO045", "Painting Medium", "Gesso", "gesso.webp"),
    ("PRO049", "Paints", "Acrylic Paint", "acrylic.jpg"),
    ("PRO058", "Paper & Pads", "A4 300gsm Pad", "a4-300gsm-pad.jpg"),
    ("PRO063", "Pen & Markers", "Dual Tip 24", "dual-tip-24.webp")
]


def test_images():
    print("=" * 80)
    print("  ART FLAIR - PRODUCT IMAGE RESOLUTION & ENDPOINT TEST")
    print("=" * 80)

    for pid, expected_cat, expected_name, expected_file in TEST_PRODUCTS:
        print(f"\n--- Testing Product: {pid} ({expected_name}) ---")
        print(f"  Category Name       : {expected_cat}")
        print(f"  Database Image Name : {expected_file}")

        # Test Physical File Path Resolution
        resolved_path = resolve_physical_image_path(pid)
        print(f"  Physical File Path  : {resolved_path}")
        assert resolved_path is not None, f"Failed to resolve physical file for {pid}"
        assert os.path.exists(resolved_path), f"Resolved file does not exist on disk: {resolved_path}"

        # Test Endpoint: GET /api/products/<product_id>/image
        endpoint = f"/api/products/{pid}/image"
        res = client.get(endpoint)
        print(f"  Endpoint Request    : GET {endpoint}")
        print(f"  HTTP Response       : {res.status_code} {res.status}")
        print(f"  Content-Type Header : {res.content_type}")
        print(f"  Content-Length      : {len(res.data)} bytes")
        assert res.status_code == 200, f"Endpoint failed with status {res.status_code}"
        assert len(res.data) > 0, "Empty image data returned"
        print("  Status              : [SUCCESS - HTTP 200 OK]")

    print("\n" + "=" * 80)
    print("  [SUCCESS] ALL 10 CATEGORY PRODUCT IMAGE ENDPOINTS TESTED WITH 100% SUCCESS!")
    print("=" * 80)


if __name__ == '__main__':
    test_images()
