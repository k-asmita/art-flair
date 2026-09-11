import os
import subprocess
from pathlib import Path

root = Path(r"c:\Project Sem 5")
static_products = root / "static" / "images" / "products"
static_products.mkdir(parents=True, exist_ok=True)

products_base = root / "Products"

folder_map = {
    'accessories': 'Accessories',
    'brushes': 'Brushes',
    'calligraphy': 'Calligraphy',
    'canvas': 'Canvas',
    'drawing-media': 'Drawing Media',
    'easels': 'Easels',
    'painting-medium': 'Painting Medium',
    'paints': 'Paints',
    'paper-pads': 'Paper & Pads',
    'pen-markers': 'Pen & Markers'
}

for slug, real_name in folder_map.items():
    source_dir = products_base / real_name
    dest_dir = static_products / slug
    if source_dir.exists() and not dest_dir.exists():
        cmd = f'cmd /c mklink /J "{dest_dir}" "{source_dir}"'
        print('Creating junction:', cmd)
        subprocess.run(cmd, shell=True)

# Also create junctions for exact category names if needed
for f in products_base.iterdir():
    if f.is_dir():
        dest = static_products / f.name
        if not dest.exists():
            cmd = f'cmd /c mklink /J "{dest}" "{f}"'
            subprocess.run(cmd, shell=True)

print("Static products directory contents:", [f.name for f in static_products.iterdir()])
