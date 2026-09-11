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
