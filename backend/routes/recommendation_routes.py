from flask import Blueprint, request
from ai_ml.recommendation_model import recommendation_engine
from middleware.auth_middleware import optional_token
from utils.response import api_response

recommendation_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')


@recommendation_bp.route('/user', methods=['GET'])
@optional_token
def get_user_recommendations():
    user = getattr(request, 'current_user', None)
    user_id = user.get('user_id') if user else None

    recommended = recommendation_engine.get_recommendations_for_user(user_id=user_id, top_n=6)
    is_personalized = bool(user_id)

    headline = "Recommended For Your Atelier" if is_personalized else "Curated Master Series Materials"
    supporting_text = (
        "Personalized fine art supply recommendations computed from your browsing, wishlist, and studio purchases."
        if is_personalized else
        "Explore professional fine art materials to initialize personalized AI recommendations."
    )

    return api_response({
        "isPersonalized": is_personalized,
        "headline": headline,
        "supportingText": supporting_text,
        "products": recommended
    })


@recommendation_bp.route('/products/<product_id>', methods=['GET'])
def get_product_recommendations(product_id):
    recommended = recommendation_engine.get_recommendations_for_product(product_id, top_n=4)
    return api_response({
        "productId": product_id,
        "pairs": recommended
    })


@recommendation_bp.route('/ai-advisor', methods=['POST'])
def get_gemini_ai_advisor():
    """Generates dynamic AI supply recommendations and studio advice via Google Gemini API."""
    from services.gemini_service import GeminiService
    from services.product_service import ProductService

    data = request.get_json() or {}
    catalog = ProductService.get_products({"page_size": 30}).get('products', [])
    result = GeminiService.recommend_supply_kit(data, catalog_products=catalog)

    # If Gemini recommended product IDs, resolve them from catalog
    if result.get("recommendedProductIds"):
        recommended_items = [p for p in catalog if p.get('id') in result["recommendedProductIds"]]
        if recommended_items:
            result["bundle"] = {
                "items": recommended_items,
                "totalPrice": sum(float(i.get('price', 0)) for i in recommended_items)
            }

    return api_response(result)


@recommendation_bp.route('/compatibility', methods=['POST'])
def check_medium_compatibility():
    """Checks chemical and archival compatibility between mediums using Gemini AI."""
    from services.gemini_service import GeminiService

    data = request.get_json() or {}
    medium_a = data.get('mediumA', 'Oil Paint')
    medium_b = data.get('mediumB', 'Acrylic Gesso')
    substrate = data.get('substrate', 'Belgian Linen')

    result = GeminiService.check_medium_compatibility(medium_a, medium_b, substrate=substrate)
    return api_response(result)

