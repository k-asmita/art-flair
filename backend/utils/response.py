from flask import jsonify


def api_response(data=None, message="Success", status_code=200, success=True, **kwargs):
    """Standardized API response helper for Art Flair."""
    payload = {
        "success": success,
        "message": message
    }
    if data is not None:
        if isinstance(data, dict):
            payload.update(data)
        else:
            payload["data"] = data
            
    payload.update(kwargs)
    return jsonify(payload), status_code


def error_response(message="An error occurred", status_code=400, errors=None, code=None):
    """Standardized error response helper."""
    payload = {
        "success": False,
        "message": message
    }
    if errors is not None:
        payload["errors"] = errors
    if code is not None:
        payload["code"] = code
        
    return jsonify(payload), status_code
