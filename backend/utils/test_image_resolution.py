import os
import pymysql
from pathlib import Path

PROJECT_ROOT = Path(r"c:\Project Sem 5")
PRODUCTS_DIR = PROJECT_ROOT / "Products"

print(f"Products directory: {PRODUCTS_DIR}")
print(f"Exists: {PRODUCTS_DIR.exists()}")

subfolders = [f.name for f in PRODUCTS_DIR.iterdir() if f.is_dir()]
print(f"Subfolders ({len(subfolders)}): {subfolders}")

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='123456',
    database='art_flair',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

with conn.cursor() as cur:
    cur.execute("SELECT category_id, category_name FROM categories ORDER BY category_id;")
    cats = cur.fetchall()
    print("\nDatabase Categories:")
    for c in cats:
        print(f"  {c['category_id']}: '{c['category_name']}'")

    cur.execute("""
        SELECT p.product_id, p.product_name, p.product_image, p.category_id, c.category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id;
    """)
    products = cur.fetchall()
    print(f"\nTotal Database Products: {len(products)}")

    print("\nSample 5 Products:")
    for p in products[:5]:
        cat_name = p['category_name']
        img_name = p['product_image']
        physical_path = PRODUCTS_DIR / cat_name / img_name
        exists = physical_path.exists()
        print(f"  Product ID: {p['product_id']} | Category: {cat_name} | Image: {img_name} | Physical Exists: {exists}")

conn.close()
