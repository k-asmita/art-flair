import os
import uuid
from flask import Blueprint, request, current_app
from services.admin_service import AdminService
from middleware.auth_middleware import admin_required, optional_token
from utils.response import api_response, error_response
from config import Config

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    stats = AdminService.get_dashboard_stats()
    return api_response({"stats": stats})


@admin_bp.route('/products', methods=['GET'])
def get_products():
    from services.product_service import ProductService
    data = ProductService.get_products({"page_size": 100})
    return api_response({"products": data['products']})


@admin_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json() or {}
    if not data.get('name') or not data.get('price'):
        return error_response("Product name and price are required.", status_code=400)

    result = AdminService.create_product(data)
    return api_response(result, message="Product created successfully in MySQL catalog.", status_code=201)


@admin_bp.route('/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json() or {}
    result = AdminService.update_product(product_id, data)
    return api_response(result, message="Product updated successfully.")


@admin_bp.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    result = AdminService.delete_product(product_id)
    return api_response(result, message="Product removed from database catalog.")


@admin_bp.route('/inventory', methods=['GET'])
def get_inventory():
    inventory = AdminService.get_inventory()
    return api_response({"inventory": inventory})


@admin_bp.route('/inventory/<product_id>', methods=['PUT'])
def update_stock(product_id):
    data = request.get_json() or {}
    new_stock = int(data.get('stock', 0))
    result = AdminService.update_stock(product_id, new_stock)
    return api_response(result, message="Stock level updated in database.")


@admin_bp.route('/orders', methods=['GET'])
def get_orders():
    orders = AdminService.get_admin_orders()
    return api_response({"orders": orders})


@admin_bp.route('/orders/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json() or {}
    new_status = data.get('status', 'Confirmed')
    result = AdminService.update_order_status(order_id, new_status)
    return api_response(result, message="Order fulfillment status updated.")


@admin_bp.route('/customers', methods=['GET'])
def get_customers():
    customers = AdminService.get_admin_customers()
    return api_response({"customers": customers})


@admin_bp.route('/analytics', methods=['GET'])
def get_analytics():
    analytics = AdminService.get_analytics()
    return api_response({"analytics": analytics})


@admin_bp.route('/upload-image', methods=['POST'])
def upload_image():
    data = request.get_json() or {}
    data_url = data.get('dataUrl')
    filename = data.get('filename', 'upload.jpg')

    # Basic safe file handling or base64 storage
    if data_url and data_url.startswith('data:image'):
        # For simplicity in local dev, return URL or save to uploads
        ext = filename.split('.')[-1] if '.' in filename else 'jpg'
        saved_name = f"product-{uuid.uuid4().hex[:8]}.{ext}"
        target_path = os.path.join(Config.UPLOAD_FOLDER, saved_name)

        try:
            import base64
            header, encoded = data_url.split(',', 1)
            file_data = base64.b64decode(encoded)
            os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
            with open(target_path, 'wb') as f:
                f.write(file_data)
            return api_response({"url": f"/uploads/{saved_name}"})
        except Exception as e:
            return error_response(f"Image processing error: {e}", status_code=500)

    return api_response({"url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80"})
