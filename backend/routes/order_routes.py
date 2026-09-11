from flask import Blueprint, request
from services.order_service import OrderService
from middleware.auth_middleware import token_required
from utils.response import api_response, error_response

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')


@order_bp.route('', methods=['GET'])
@token_required
def get_orders():
    user_id = request.current_user['user_id']
    orders = OrderService.get_user_orders(user_id)
    return api_response({"orders": orders})


@order_bp.route('/checkout', methods=['POST'])
@token_required
def checkout():
    user_id = request.current_user['user_id']
    data = request.get_json() or {}

    result, err = OrderService.create_order(user_id, data)
    if err:
        return error_response(err, status_code=422)

    return api_response(result, message="Order verified, created, and confirmed.", status_code=201)
