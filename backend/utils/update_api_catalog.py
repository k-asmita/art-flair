import json
from pathlib import Path

root = Path(r"c:\Project Sem 5")
catalog_file = root / "backend" / "local_catalog.json"
api_js_file = root / "js" / "api.js"

with open(catalog_file, "r", encoding="utf-8") as f:
    products = json.load(f)

products_js = "const MOCK_DATABASE_PRODUCTS = " + json.dumps(products, indent=2) + ";\n"

with open(api_js_file, "r", encoding="utf-8") as f:
    content = f.read()

# Replace MOCK_DATABASE_PRODUCTS block in api.js
start_marker = "const MOCK_DATABASE_PRODUCTS = ["
end_marker = "];\n\n// In-Memory Storage Simulator"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + 2
    new_content = content[:start_idx] + products_js + content[end_idx:]
    with open(api_js_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated js/api.js with all 73 local Products folder items!")
else:
    # Fallback search for end of array
    print("Markers not found exactly, searching alternative...")
    idx1 = content.find("const MOCK_DATABASE_PRODUCTS =")
    idx2 = content.find("// In-Memory Storage Simulator", idx1)
    if idx1 != -1 and idx2 != -1:
        new_content = content[:idx1] + products_js + "\n" + content[idx2:]
        with open(api_js_file, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated js/api.js using fallback slice!")
    else:
        print("Error: Could not find MOCK_DATABASE_PRODUCTS block in api.js")
