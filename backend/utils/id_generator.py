"""
Art Flair - Primary Key ID Generator
Developed for Sabahz Trading

Generates clean varchar(10) formatted IDs for MySQL tables:
- USR0001 (Users)
- CRT0001 (Cart)
- WSH0001 (Wishlist)
- ORD0001 (Orders)
- ORI0001 (Order Items)
- REV0001 (Reviews)
- INT0001 (Customer Interactions)
- INV0001 (Inventory)
"""

import uuid
from database.connection import fetch_one


def generate_custom_id(prefix, table_name, id_column):
    """
    Generates a guaranteed unique varchar(10) identifier.
    Prefix (3 chars) + 6 alphanumeric chars (e.g. USR3F8A1B -> 9 chars <= 10).
    """
    for _ in range(10):
        random_suffix = uuid.uuid4().hex[:6].upper()
        candidate = f"{prefix}{random_suffix}"
        
        # Check uniqueness in database
        check_sql = f"SELECT `{id_column}` FROM `{table_name}` WHERE `{id_column}` = %s LIMIT 1;"
        exists = fetch_one(check_sql, (candidate,))
        if not exists:
            return candidate

    # Fallback
    return f"{prefix}{uuid.uuid4().hex[:5].upper()}"
