import json
from pathlib import Path

root = Path(r"c:\Project Sem 5")
catalog_file = root / "backend" / "local_catalog.json"
api_js_file = root / "js" / "api.js"

with open(catalog_file, "r", encoding="utf-8") as f:
    products = json.load(f)

products_js = "const MOCK_DATABASE_PRODUCTS = " + json.dumps(products, indent=2) + ";\n"

with open(api_js_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find start line (1-indexed line 10) and end line (line 327)
start_line = None
end_line = None

for i, line in enumerate(lines):
    if "const MOCK_DATABASE_PRODUCTS = [" in line:
        start_line = i
    if "const MOCK_CATEGORIES = [" in line:
        end_line = i
        break

if start_line is not None and end_line is not None:
    new_lines = lines[:start_line] + [products_js + "\n"] + lines[end_line:]
    with open(api_js_file, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("SUCCESS: js/api.js updated with all 73 local Products folder items!")
else:
    print(f"Error: start={start_line}, end={end_line}")
