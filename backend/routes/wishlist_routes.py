from flask import Blueprint, request
from services.wishlist_service import WishlistService
from middleware.auth_middleware import token_required
from utils.response import api_response, error_response

wishlist_bp = Blueprint('wishlist', __name__, url_prefix='/api/wishlist')


@wishlist_bp.route('', methods=['GET'])
@token_required
def get_wishlist():
    user_id = request.current_user['user_id']
    data = WishlistService.get_wishlist(user_id)
    return api_response(data)


@wishlist_bp.route('/add', methods=['POST'])
@token_required
def add_to_wishlist():
    user_id = request.current_user['user_id']
    data = request.get_json() or {}
    product_id = data.get('productId')

    if not product_id:
        return error_response("Product ID is required.", status_code=400)

    result = WishlistService.add_to_wishlist(user_id, product_id)
    return api_response(result, message="Material saved to studio wishlist.")


@wishlist_bp.route('/items/<item_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(item_id):
    user_id = request.current_user['user_id']
    result = WishlistService.remove_from_wishlist(user_id, item_id)
    return api_response(result, message="Material removed from wishlist.")
