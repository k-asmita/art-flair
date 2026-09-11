import os
import json
from pathlib import Path

root = Path(r"c:\Project Sem 5")
products_dir = root / "Products"

category_meta = {
    'Accessories': {'cat_id': 'accessories', 'price_range': (180, 750)},
    'Brushes': {'cat_id': 'brushes', 'price_range': (350, 1850)},
    'Calligraphy': {'cat_id': 'calligraphy', 'price_range': (450, 2200)},
    'Canvas': {'cat_id': 'canvas', 'price_range': (280, 2400)},
    'Drawing Media': {'cat_id': 'drawing-media', 'price_range': (199, 1600)},
    'Easels': {'cat_id': 'easels', 'price_range': (850, 4200)},
    'Painting Medium': {'cat_id': 'painting-medium', 'price_range': (240, 1150)},
    'Paints': {'cat_id': 'paints', 'price_range': (320, 3500)},
    'Paper & Pads': {'cat_id': 'paper-pads', 'price_range': (220, 1450)},
    'Pen & Markers': {'cat_id': 'pen-markers', 'price_range': (299, 2100)}
}

catalog = []
counter = 1

for cat_folder in sorted(products_dir.iterdir()):
    if cat_folder.is_dir():
        cat_name = cat_folder.name
        meta = category_meta.get(cat_name, {'cat_id': cat_name.lower().replace('&', '').replace(' ', '-'), 'price_range': (200, 1000)})
        for img_file in sorted(cat_folder.iterdir()):
            if img_file.is_file() and img_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                stem = img_file.stem
                formatted_name = ' '.join(word.capitalize() for word in stem.replace('-', ' ').replace('_', ' ').split())
                pid = f"PRO{counter:03d}"
                
                # Image paths directly referencing the local Products folder
                rel_img = f"Products/{cat_name}/{img_file.name}"
                
                p_min, p_max = meta['price_range']
                price_val = float(p_min + ((counter * 73) % (p_max - p_min)))
                
                catalog.append({
                    "id": pid,
                    "product_id": pid,
                    "name": formatted_name,
                    "product_name": formatted_name,
                    "category": cat_name,
                    "category_name": cat_name,
                    "categoryId": meta['cat_id'],
                    "category_id": meta['cat_id'],
                    "product_image": f"products/{meta['cat_id']}/{img_file.name}",
                    "image": rel_img,
                    "image_url": rel_img,
                    "price": price_val,
                    "originalPrice": round(price_val * 1.15, 2),
                    "discount": 10 if counter % 3 == 0 else 0,
                    "stock": 15 + (counter % 35),
                    "rating": round(4.5 + ((counter % 5) * 0.1), 1),
                    "reviewsCount": 10 + (counter * 3),
                    "brand": "Artisan Atelier" if counter % 2 == 0 else "Sabahz Master Series",
                    "description": f"Master-grade archival {formatted_name.lower()} curated for studio artists and creative disciplines.",
                    "specifications": {
                        "Medium": cat_name,
                        "Grade": "Artist Archival Grade",
                        "Origin": "Sabahz Trading Curated",
                        "Safety Standard": "ASTM D-4236 Certified"
                    },
                    "isFeatured": counter in [1, 13, 24, 29, 32, 42, 45, 49, 58, 63],
                    "isBestSeller": counter % 4 == 0,
                    "isAvailable": True,
                    "is_available": True
                })
                counter += 1

print(f"Generated {len(catalog)} products from local Products folder.")

output_file = root / "backend" / "local_catalog.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)

print(f"Saved catalog to {output_file}")
