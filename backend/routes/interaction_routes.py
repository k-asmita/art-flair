from flask import Blueprint, request
from services.interaction_service import InteractionService
from middleware.auth_middleware import optional_token
from utils.response import api_response

interaction_bp = Blueprint('interactions', __name__, url_prefix='/api/interactions')


@interaction_bp.route('', methods=['POST'])
@optional_token
def record_interaction():
    user = getattr(request, 'current_user', None)
    user_id = user.get('user_id') if user else None
    data = request.get_json() or {}

    interaction_type = data.get('interactionType') or data.get('interaction_type', 'view')
    product_id = data.get('productId') or data.get('product_id')
    search_query = data.get('searchQuery') or data.get('search_query')

    int_id = InteractionService.record_interaction(user_id, interaction_type, product_id=product_id, search_query=search_query)
    return api_response({"interaction_id": int_id})
