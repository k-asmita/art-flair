import os
from pathlib import Path

root = Path(r"c:\Project Sem 5")
cart_drawer_script = '  <script src="js/components/cart-drawer.js"></script>'

html_files = [
    "index.html",
    "shop.html",
    "products.html",
    "product-details.html",
    "cart.html",
    "wishlist.html",
    "checkout.html",
    "orders.html",
    "profile.html",
    "ai-matcher.html"
]

for name in html_files:
    fpath = root / name
    if fpath.exists():
        content = fpath.read_text(encoding="utf-8")
        if "js/components/cart-drawer.js" not in content:
            if '<script src="js/components/header.js"></script>' in content:
                content = content.replace(
                    '<script src="js/components/header.js"></script>',
                    f'{cart_drawer_script}\n  <script src="js/components/header.js"></script>'
                )
                fpath.write_text(content, encoding="utf-8")
                print(f"Added cart-drawer.js to {name}")
            else:
                print(f"header.js tag not found in {name}")
        else:
            print(f"cart-drawer.js already in {name}")
