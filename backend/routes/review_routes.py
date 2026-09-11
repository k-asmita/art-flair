from flask import Blueprint, request
from services.review_service import ReviewService
from middleware.auth_middleware import token_required
from utils.response import api_response, error_response

review_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')


@review_bp.route('/<product_id>', methods=['GET'])
def get_reviews(product_id):
    reviews = ReviewService.get_product_reviews(product_id)
    return api_response({"reviews": reviews})


@review_bp.route('', methods=['POST'])
@token_required
def add_review():
    user_id = request.current_user['user_id']
    data = request.get_json() or {}
    product_id = data.get('productId') or data.get('product_id')
    rating = data.get('rating')
    review_text = data.get('reviewText') or data.get('review_text') or ''

    result, err = ReviewService.add_review(user_id, product_id, rating, review_text)
    if err:
        return error_response(err, status_code=400)

    return api_response(result, message="Review submitted successfully.", status_code=201)
