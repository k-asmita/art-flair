from flask import Blueprint, request
from services.auth_service import AuthService
from middleware.auth_middleware import token_required
from utils.response import api_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return error_response("Name, email, and password are required.", status_code=400)

    clean_email = email.lower().strip()
    if clean_email == "admin@gmail.com":
        return error_response("This email address is reserved for administration.", status_code=403)

    # Public registration is strictly for customer patron accounts
    result, err = AuthService.register(name, clean_email, password, role="customer")
    if err:
        return error_response(err, status_code=409)

    return api_response(result, message="Patron atelier account created successfully.", status_code=201)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    remember_me = data.get('rememberMe', False)

    if not email or not password:
        return error_response("Email and password are required.", status_code=400)

    result, err = AuthService.login(email, password, remember_me=remember_me)
    if err:
        return error_response(err, status_code=401)

    return api_response(result, message="Authenticated successfully.")


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    return api_response(message="Signed out of studio session.")


@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    user_id = request.current_user['user_id']
    profile = AuthService.get_profile(user_id)
    if not profile:
        return error_response("Profile not found.", status_code=404)
    return api_response({"user": profile})


@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user_id = request.current_user['user_id']
    data = request.get_json() or {}
    updated = AuthService.update_profile(user_id, data)
    return api_response({"user": updated}, message="Studio profile updated successfully.")


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return error_response("Please enter your registered studio email.", status_code=400)

    result, err = AuthService.forgot_password(email)
    if err:
        return error_response(err, status_code=400)

    return api_response(result, message="Password recovery code issued.")


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    email = data.get('email')
    new_password = data.get('password') or data.get('newPassword')

    if not email or not new_password:
        return error_response("Email and new password are required.", status_code=400)

    if len(new_password) < 8:
        return error_response("Password must contain at least 8 characters.", status_code=400)

    result, err = AuthService.reset_password(email, new_password)
    if err:
        return error_response(err, status_code=400)

    return api_response(result, message="Password updated successfully.")

