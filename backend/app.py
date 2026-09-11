import os
import urllib.parse
from pathlib import Path
import logging
from flask import Flask, send_from_directory, send_file, jsonify, abort
from flask_cors import CORS
from config import Config
from database.connection import test_database_connection
from utils.image_utils import get_products_dir, is_safe_path
from utils.response import api_response

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
logger = logging.getLogger(__name__)


def create_app():
    """Application factory for Art Flair API Server."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all frontend origins
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}, r"/products/*": {"origins": "*"}, r"/Products/*": {"origins": "*"}})

    # Ensure uploads directory exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    # Register Route Blueprints
    from routes.auth_routes import auth_bp
    from routes.product_routes import product_bp
    from routes.cart_routes import cart_bp
    from routes.wishlist_routes import wishlist_bp
    from routes.order_routes import order_bp
    from routes.review_routes import review_bp
    from routes.interaction_routes import interaction_bp
    from routes.search_routes import search_bp
    from routes.recommendation_routes import recommendation_bp
    from routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(interaction_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(admin_bp)

    # Static image routes matching /static/images/${product.product_image}
    @app.route('/static/images/<path:filepath>')
    @app.route('/static/images/products/<path:filepath>')
    def serve_static_images(filepath):
        from utils.image_utils import resolve_static_image_path, get_image_mimetype
        # Check direct or relative
        full_rel = filepath if filepath.startswith('products/') else f"products/{filepath}"
        resolved = resolve_static_image_path(filepath) or resolve_static_image_path(full_rel)

        if resolved and os.path.exists(resolved):
            mimetype = get_image_mimetype(resolved)
            response = send_file(resolved, mimetype=mimetype)
            response.headers['Cache-Control'] = 'public, max-age=86400'
            return response

        logger.warning(f"[Static Image 404]: {filepath}")
        abort(404)

    # Safe Static Product Image Serving from existing Products folder
    @app.route('/products/<path:category_and_filename>')
    @app.route('/Products/<path:category_and_filename>')
    def serve_product_image(category_and_filename):
        from utils.image_utils import resolve_static_image_path, get_image_mimetype
        resolved = resolve_static_image_path(category_and_filename) or resolve_static_image_path(f"products/{category_and_filename}")

        if resolved and os.path.exists(resolved):
            mimetype = get_image_mimetype(resolved)
            return send_file(resolved, mimetype=mimetype)

        products_base = get_products_dir()
        decoded_path = urllib.parse.unquote(category_and_filename)
        target_path = (products_base / decoded_path).resolve()

        if target_path.exists() and target_path.is_file() and is_safe_path(products_base, target_path):
            return send_file(str(target_path))

        abort(404)

    # Static file serving for user uploads
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    # Health Check Endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        db_res = test_database_connection()
        return api_response({
            "service": "Art Flair Python Backend API",
            "version": "2.5.0",
            "status": "healthy",
            "database": db_res.get("database"),
            "mysql_status": "connected" if db_res.get("connected") else "unreachable",
            "mysql_version": db_res.get("mysql_version"),
            "ai_ml_engine": "operational"
        })

    # Global 404 & 500 error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "API endpoint or resource not found."}), 404

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({"success": False, "message": "An internal server error occurred."}), 500

    return app


app = create_app()

if __name__ == '__main__':
    from ai_ml.recommendation_model import recommendation_engine
    logger.info("Training AI/ML recommendation engine...")
    recommendation_engine.train_model()

    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('DEBUG', 'True').lower() in ['true', '1']

    logger.info(f"🎨 Art Flair Backend starting on http://localhost:{port}")
    app.run(host=host, port=port, debug=debug)
