import os
from pathlib import Path
from dotenv import load_dotenv

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent

# Load .env file
env_path = BASE_DIR / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Config:
    """Art Flair Server Configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_art_flair_secret_key_2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_jwt_secret_key_2026')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 72))

    # MySQL 8.0 Settings
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'art_flair_db')

    # Media and Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, os.getenv('UPLOAD_FOLDER', 'uploads'))
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16 MB

    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')

    # Application details
    CURRENCY = 'INR'
    STORE_NAME = 'Art Flair - Sabahz Trading'
    FREE_SHIPPING_THRESHOLD = 1499.00
    TAX_RATE = 0.12  # 12% GST

    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_TaSPXLlC9EXMVC')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'nYQy7lrOyFG5TxzRzHouXc1T')

    # Google Gemini AI Recommendation Engine
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')

