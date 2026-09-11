"""
Art Flair - Authentication Service Layer
Bound strictly to MySQL 'users' table in 'art_flair' database.
"""

import datetime
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import fetch_one, execute_query
from utils.id_generator import generate_custom_id
from config import Config
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication and Patron User Profile Service."""

    @staticmethod
    def register(first_name, last_name, email, password, phone=None, role="customer"):
        email = email.lower().strip()
        existing = fetch_one("SELECT user_id FROM users WHERE email = %s;", (email,))
        if existing:
            return None, "An atelier account with this email address already exists."

        prefix = "ADM" if role == "admin" else "USR"
        user_id = generate_custom_id(prefix, 'users', 'user_id')
        password_hash = generate_password_hash(password)

        execute_query("""
            INSERT INTO users (user_id, first_name, last_name, email, password_hash, phone, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (user_id, first_name.strip(), (last_name or '').strip(), email, password_hash, phone, role))

        user_data = {
            "id": user_id,
            "user_id": user_id,
            "firstName": first_name.strip(),
            "first_name": first_name.strip(),
            "lastName": (last_name or '').strip(),
            "last_name": (last_name or '').strip(),
            "name": f"{first_name} {last_name or ''}".strip(),
            "email": email,
            "phone": phone or "",
            "role": role,
            "isGuest": False
        }
        token = AuthService._generate_token(user_data)
        return {"token": token, "user": user_data}, None

    @staticmethod
    def login(email, password, remember_me=False):
        email = email.lower().strip()
        user = fetch_one("""
            SELECT user_id, first_name, last_name, email, password_hash, phone, role
            FROM users WHERE email = %s;
        """, (email,))

        if not user or not check_password_hash(user['password_hash'], password):
            return None, "Invalid studio email or password."

        full_name = f"{user['first_name']} {user['last_name'] or ''}".strip()
        user_data = {
            "id": user['user_id'],
            "user_id": user['user_id'],
            "firstName": user['first_name'],
            "first_name": user['first_name'],
            "lastName": user['last_name'] or '',
            "last_name": user['last_name'] or '',
            "name": full_name,
            "email": user['email'],
            "phone": user.get('phone') or '',
            "role": user.get('role', 'customer'),
            "isGuest": False
        }
        token = AuthService._generate_token(user_data, remember_me=remember_me)
        return {"token": token, "user": user_data}, None

    @staticmethod
    def get_profile(user_id):
        user = fetch_one("""
            SELECT user_id, first_name, last_name, email, phone, role, created_at, updated_at
            FROM users WHERE user_id = %s;
        """, (user_id,))
        if not user:
            return None
        full_name = f"{user['first_name']} {user['last_name'] or ''}".strip()
        return {
            "id": user['user_id'],
            "user_id": user['user_id'],
            "firstName": user['first_name'],
            "first_name": user['first_name'],
            "lastName": user['last_name'] or '',
            "last_name": user['last_name'] or '',
            "name": full_name,
            "email": user['email'],
            "phone": user.get('phone') or '',
            "role": user.get('role', 'customer'),
            "joinedDate": user['created_at'].isoformat() if hasattr(user['created_at'], 'isoformat') else str(user['created_at']),
            "isGuest": False
        }

    @staticmethod
    def update_profile(user_id, data):
        first_name = data.get('firstName') or data.get('first_name') or data.get('name')
        last_name = data.get('lastName') or data.get('last_name')
        phone = data.get('phone')

        execute_query("""
            UPDATE users SET
                first_name = COALESCE(%s, first_name),
                last_name = COALESCE(%s, last_name),
                phone = COALESCE(%s, phone)
            WHERE user_id = %s;
        """, (first_name, last_name, phone, user_id))

        return AuthService.get_profile(user_id)

    @staticmethod
    def _generate_token(user_dict, remember_me=False):
        exp_hours = Config.JWT_EXPIRATION_HOURS * 4 if remember_me else Config.JWT_EXPIRATION_HOURS
        exp_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=exp_hours)
        payload = {
            "user_id": user_dict['user_id'],
            "email": user_dict['email'],
            "name": user_dict['name'],
            "role": user_dict.get('role', 'customer'),
            "exp": exp_time
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
