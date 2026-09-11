from flask import Blueprint, request
from services.cart_service import CartService
from middleware.auth_middleware import optional_token
from utils.response import api_response, error_response

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')


def _get_active_user_id():
    user = getattr(request, 'current_user', None)
    if user and user.get('user_id') and len(user['user_id']) <= 10:
        return user['user_id']
    return "USR001"


@cart_bp.route('', methods=['GET'])
@optional_token
def get_cart():
    user_id = _get_active_user_id()
    cart = CartService.get_cart(user_id=user_id)
    return api_response(cart)


@cart_bp.route('/add', methods=['POST'])
@optional_token
def add_to_cart():
    user_id = _get_active_user_id()
    data = request.get_json() or {}
    product_id = data.get('productId') or data.get('product_id')
    quantity = int(data.get('quantity', 1))

    if not product_id:
        return error_response("Product ID is required.", status_code=400)

    cart, err = CartService.add_to_cart(user_id=user_id, product_id=product_id, quantity=quantity)
    if err:
        return error_response(err, status_code=400)

    return api_response(cart, message="Material added to studio cart.")


@cart_bp.route('/update', methods=['PUT', 'POST'])
@optional_token
def update_cart_item_alt():
    user_id = _get_active_user_id()
    data = request.get_json() or {}
    item_id = data.get('cartItemId') or data.get('productId') or data.get('product_id') or data.get('cart_id')
    quantity = int(data.get('quantity', 1))

    cart, err = CartService.update_cart_item(user_id, item_id, quantity)
    if err:
        return error_response(err, status_code=400)

    return api_response(cart, message="Cart quantity updated.")


@cart_bp.route('/items/<item_id>', methods=['PUT'])
@optional_token
def update_cart_item(item_id):
    user_id = _get_active_user_id()
    data = request.get_json() or {}
    quantity = int(data.get('quantity', 1))

    cart, err = CartService.update_cart_item(user_id, item_id, quantity)
    if err:
        return error_response(err, status_code=400)

    return api_response(cart, message="Cart quantity updated.")


@cart_bp.route('/items/<item_id>', methods=['DELETE'])
@optional_token
def remove_cart_item(item_id):
    user_id = _get_active_user_id()
    cart, err = CartService.remove_cart_item(user_id, item_id)
    if err:
        return error_response(err, status_code=400)

    return api_response(cart, message="Material removed from cart.")


@cart_bp.route('/clear', methods=['POST', 'DELETE'])
@optional_token
def clear_cart():
    user_id = _get_active_user_id()
    cart, err = CartService.clear_cart(user_id)
    if err:
        return error_response(err, status_code=400)

    return api_response(cart, message="Cart cleared.")
