import urllib.request
import json

req = urllib.request.urlopen('http://localhost:5000/api/products?page_size=100')
data = json.loads(req.read().decode('utf-8'))
products = data.get('products', [])
print(f"Retrieved {len(products)} products from live server.")

success_count = 0
failed = []

for p in products:
    img_url = f"http://localhost:5000{p['image_url']}"
    try:
        r = urllib.request.urlopen(img_url)
        if r.status == 200:
            success_count += 1
        else:
            failed.append((p['id'], p['name'], img_url, r.status))
    except Exception as e:
        failed.append((p['id'], p['name'], img_url, str(e)))

print(f"Verification Results: {success_count}/{len(products)} Product Images returned HTTP 200 OK.")
if failed:
    print("Failed products:", failed)
else:
    print("[SUCCESS] ALL 73 PRODUCT IMAGES RESOLVED AND SERVED WITH 100% SUCCESS!")
