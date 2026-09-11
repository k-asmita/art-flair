from flask import Blueprint, request
from services.product_service import ProductService
from utils.response import api_response

search_bp = Blueprint('search', __name__, url_prefix='/api/search')


@search_bp.route('', methods=['GET'])
def search_catalog():
    query = request.args.get('q', '').strip()
    category = request.args.get('category')
    page = request.args.get('page', 1)

    filters = {"q": query, "category": category, "page": page, "page_size": 16}
    data = ProductService.get_products(filters)

    return api_response({
        "query": query,
        "provider": "standard-keyword",
        "resultCount": data['total'],
        "products": data['products']
    })


@search_bp.route('/suggestions', methods=['GET'])
def search_suggestions():
    query = request.args.get('q', '').strip()
    if not query:
        return api_response({"query": "", "categories": [], "products": []})

    data = ProductService.get_products({"q": query, "page_size": 4})
    all_cats = ProductService.get_categories()
    matched_cats = [c for c in all_cats if query.lower() in c['name'].lower()][:3]

    return api_response({
        "query": query,
        "categories": matched_cats,
        "products": data['products']
    })
