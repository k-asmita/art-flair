"""
Art Flair - Static & Product Image Resolution Utility
Developed for Sabahz Trading
"""

import os
import mimetypes
import urllib.parse
from pathlib import Path
from database.connection import fetch_one
import logging

logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
PRODUCTS_DIR = PROJECT_ROOT / "Products"
STATIC_DIR = PROJECT_ROOT / "static"
STATIC_IMAGES_DIR = STATIC_DIR / "images"

CATEGORY_SLUG_MAP = {
    'accessories': 'Accessories',
    'brushes': 'Brushes',
    'calligraphy': 'Calligraphy',
    'canvas': 'Canvas',
    'drawing-media': 'Drawing Media',
    'drawing media': 'Drawing Media',
    'easels': 'Easels',
    'painting-medium': 'Painting Medium',
    'painting medium': 'Painting Medium',
    'paints': 'Paints',
    'paper-pads': 'Paper & Pads',
    'paper & pads': 'Paper & Pads',
    'pen-markers': 'Pen & Markers',
    'pen & markers': 'Pen & Markers'
}


def get_products_dir():
    return PRODUCTS_DIR


def get_static_images_dir():
    return STATIC_IMAGES_DIR


def is_safe_path(base_dir, target_path):
    try:
        resolved_base = Path(base_dir).resolve()
        resolved_target = Path(target_path).resolve()
        return resolved_base in resolved_target.parents or resolved_base == resolved_target
    except Exception:
        return False


def resolve_static_image_path(relative_path):
    """
    Resolves relative path like 'products/accessories/clay-tools.webp' or 'accessories/clay-tools.webp'
    directly to the physical file in 'c:\\Project Sem 5\\static\\images\\...' or 'c:\\Project Sem 5\\Products\\...'
    """
    decoded = urllib.parse.unquote(relative_path).replace('\\', '/').strip('/')
    
    # 1. Try direct static directory
    static_candidate = STATIC_IMAGES_DIR / decoded
    if static_candidate.exists() and static_candidate.is_file() and is_safe_path(STATIC_DIR, static_candidate):
        return str(static_candidate)

    # 2. Try stripping leading 'products/'
    clean_path = decoded
    if clean_path.lower().startswith('products/'):
        clean_path = clean_path[9:]

    parts = clean_path.split('/')
    if len(parts) >= 2:
        cat_slug, img_name = parts[0], '/'.join(parts[1:])
        real_cat_folder = CATEGORY_SLUG_MAP.get(cat_slug.lower(), cat_slug)
        
        # Check in Products/<Category>/<Image>
        prod_candidate = PRODUCTS_DIR / real_cat_folder / img_name
        if prod_candidate.exists() and prod_candidate.is_file() and is_safe_path(PRODUCTS_DIR, prod_candidate):
            return str(prod_candidate)

        # Check in static/images/products/<slug>/<Image>
        stat_candidate = STATIC_IMAGES_DIR / 'products' / cat_slug / img_name
        if stat_candidate.exists() and stat_candidate.is_file() and is_safe_path(STATIC_DIR, stat_candidate):
            return str(stat_candidate)

    return None


def resolve_physical_image_path(product_id):
    """Resolves physical file for product_id using database info."""
    sql = """
        SELECT p.product_id, p.product_image, c.category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = %s;
    """
    row = fetch_one(sql, (product_id,))
    if not row:
        return None

    img_path = row.get('product_image') or ''
    if img_path:
        resolved = resolve_static_image_path(img_path)
        if resolved:
            return resolved

    # Fallback to category folder match
    cat_name = row.get('category_name')
    if cat_name and img_path:
        filename = os.path.basename(img_path)
        cand = PRODUCTS_DIR / cat_name / filename
        if cand.exists() and cand.is_file():
            return str(cand)

    return None


def get_product_image_endpoint_url(product_id_or_path, product_image=None):
    if product_image:
        return f"/static/images/{product_image.lstrip('/')}"
    
    if str(product_id_or_path).startswith('products/'):
        return f"/static/images/{product_id_or_path}"

    return f"/api/products/{product_id_or_path}/image"


resolve_product_image_url = get_product_image_endpoint_url


def get_image_mimetype(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.webp':
        return 'image/webp'
    elif ext in ['.jpg', '.jpeg']:
        return 'image/jpeg'
    elif ext == '.png':
        return 'image/png'
    elif ext == '.svg':
        return 'image/svg+xml'
    elif ext == '.gif':
        return 'image/gif'
    
    mime, _ = mimetypes.guess_type(file_path)
    return mime or 'image/jpeg'
