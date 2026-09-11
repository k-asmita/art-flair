import os
from pathlib import Path

root = Path(r"c:\Project Sem 5")
static_prod = root / "static" / "images" / "products"

print("static/images/products exists:", static_prod.exists())
if static_prod.exists():
    for d in sorted(static_prod.iterdir()):
        if d.is_dir():
            files = list(d.iterdir())
            sample = files[0].name if files else "none"
            print(f"  {d.name}: {len(files)} files (sample: {sample})")
