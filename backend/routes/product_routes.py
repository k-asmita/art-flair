from flask import Blueprint, request, send_file, abort, jsonify
from services.product_service import ProductService
from utils.image_utils import resolve_physical_image_path, get_image_mimetype
from utils.response import api_response, error_response
import logging

logger = logging.getLogger(__name__)

product_bp = Blueprint('products', __name__, url_prefix='/api')


@product_bp.route('/products', methods=['GET'])
def get_products():
    filters = {
        "category": request.args.get('category'),
        "brand": request.args.get('brand'),
        "q": request.args.get('q'),
        "min_price": request.args.get('min_price'),
        "max_price": request.args.get('max_price'),
        "in_stock": request.args.get('in_stock'),
        "sort": request.args.get('sort'),
        "page": request.args.get('page', 1),
        "page_size": request.args.get('page_size', 12)
    }
    data = ProductService.get_products(filters)
    return api_response(data)


@product_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    prod = ProductService.get_product_by_id(product_id)
    if not prod:
        return error_response(f"Product '{product_id}' not found.", status_code=404)
    return api_response({"product": prod})


@product_bp.route('/products/<product_id>/image', methods=['GET'])
def get_product_image(product_id):
    """
    Secure product image serving endpoint:
    GET /api/products/<product_id>/image
    Resolves MySQL products.product_image + categories.category_name to the actual physical file.
    """
    image_path = resolve_physical_image_path(product_id)

    if not image_path:
        logger.warning(f"[Product Image API] Image not found for product_id '{product_id}'")
        return jsonify({"success": False, "message": f"Product image for '{product_id}' not found."}), 404

    mimetype = get_image_mimetype(image_path)
    response = send_file(image_path, mimetype=mimetype)
    response.headers['Cache-Control'] = 'public, max-age=86400'  # Cache 1 day
    return response


@product_bp.route('/products/featured', methods=['GET'])
def get_featured_products():
    data = ProductService.get_products({"sort": "rating", "page_size": 8})
    return api_response({"products": data['products']})


@product_bp.route('/products/best-sellers', methods=['GET'])
def get_best_sellers():
    data = ProductService.get_products({"sort": "rating", "page_size": 8})
    return api_response({"products": data['products']})


@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = ProductService.get_categories()
    return api_response({"categories": categories})


@product_bp.route('/brands', methods=['GET'])
def get_brands():
    brands = ProductService.get_brands()
    return api_response({"brands": brands})
