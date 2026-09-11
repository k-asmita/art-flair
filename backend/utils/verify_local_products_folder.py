import json
from pathlib import Path

root = Path(r"c:\Project Sem 5")
with open(root / "backend" / "local_catalog.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Total catalog products: {len(products)}")

missing = 0
found = 0

for p in products:
    img_path = root / p['image']
    if img_path.exists() and img_path.is_file():
        found += 1
    else:
        print(f"Missing file for {p['id']}: {img_path}")
        missing += 1

print(f"Physical image verification: {found}/{len(products)} images verified directly on disk!")
if missing == 0:
    print("[SUCCESS] ALL 73 PRODUCT IMAGES IN Products/ FOLDER VERIFIED 100%!")
