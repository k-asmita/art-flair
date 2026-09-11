import jwt
from functools import wraps
from flask import request
from config import Config
from utils.response import error_response


def token_required(f):
    """
    Decorator requiring valid JWT token in Authorization header:
    Authorization: Bearer <token>
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        token = None

        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return error_response(
                message="Authentication required. Please provide a valid Bearer token.",
                status_code=401,
                code="AUTH_TOKEN_MISSING"
            )

        try:
            payload = jwt.decode(
                token,
                Config.JWT_SECRET_KEY,
                algorithms=['HS256']
            )
            # Pass decoded current_user to route handler
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return error_response(
                message="Your studio session has expired. Please sign in again.",
                status_code=401,
                code="AUTH_TOKEN_EXPIRED"
            )
        except (jwt.InvalidTokenError, Exception) as e:
            return error_response(
                message=f"Invalid authentication token: {str(e)}",
                status_code=401,
                code="AUTH_TOKEN_INVALID"
            )

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    """
    Decorator requiring administrator privileges.
    """
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        current_user = getattr(request, 'current_user', {})
        role = current_user.get('role', 'customer')

        if role != 'admin':
            return error_response(
                message="Forbidden: Master atelier administrator privileges required.",
                status_code=403,
                code="FORBIDDEN_ADMIN_ONLY"
            )

        return f(*args, **kwargs)

    return decorated


def optional_token(f):
    """
    Optional token extractor: sets request.current_user if valid token provided, else None.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        request.current_user = None

        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
                try:
                    request.current_user = jwt.decode(
                        token,
                        Config.JWT_SECRET_KEY,
                        algorithms=['HS256']
                    )
                except Exception:
                    pass

        return f(*args, **kwargs)

    return decorated
