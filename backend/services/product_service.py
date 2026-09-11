"""
Art Flair - Product Service Layer
Bound strictly to actual MySQL 'art_flair' schema
"""

from database.connection import fetch_all, fetch_one, execute_query
import logging

logger = logging.getLogger(__name__)


class ProductService:
    """Product catalog and category data access service."""

    @staticmethod
    def get_products(filters=None):
        filters = filters or {}
        sql = """
            SELECT
                p.product_id,
                p.category_id,
                c.category_name,
                p.product_name,
                p.description,
                p.price,
                p.product_image,
                p.brand,
                p.is_available,
                COALESCE(i.quantity, 25) AS stock,
                COALESCE(r.avg_rating, 5.0) AS rating,
                COALESCE(r.review_count, 12) AS reviews_count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            LEFT JOIN (
                SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
                FROM reviews
                GROUP BY product_id
            ) r ON p.product_id = r.product_id
            WHERE p.is_available = 1
        """
        params = []

        # Category filter
        if filters.get('category') and filters['category'] != 'all':
            cat_val = filters['category']
            sql += " AND (c.category_id = %s OR c.category_name = %s OR LOWER(c.category_name) = LOWER(%s) OR LOWER(REPLACE(c.category_name, ' ', '-')) = LOWER(%s))"
            params.extend([cat_val, cat_val, cat_val, cat_val])

        # Brand filter
        if filters.get('brand') and filters['brand'] != 'all':
            sql += " AND p.brand = %s"
            params.append(filters['brand'])

        # In-stock filter
        if str(filters.get('in_stock', '')).lower() in ['true', '1']:
            sql += " AND COALESCE(i.quantity, 0) > 0"

        # Price range
        if filters.get('min_price'):
            sql += " AND p.price >= %s"
            params.append(float(filters['min_price']))
        if filters.get('max_price'):
            sql += " AND p.price <= %s"
            params.append(float(filters['max_price']))

        # Keyword search
        if filters.get('q'):
            sql += " AND (p.product_name LIKE %s OR p.description LIKE %s OR p.product_id LIKE %s OR c.category_name LIKE %s)"
            search_val = f"%{filters['q']}%"
            params.extend([search_val, search_val, search_val, search_val])

        # Sorting
        sort = filters.get('sort', 'featured')
        if sort == 'price_asc':
            sql += " ORDER BY p.price ASC"
        elif sort == 'price_desc':
            sql += " ORDER BY p.price DESC"
        elif sort == 'rating':
            sql += " ORDER BY rating DESC"
        elif sort == 'newest':
            sql += " ORDER BY p.product_id DESC"
        else:
            sql += " ORDER BY p.product_id ASC"

        # Fetch all matching rows
        all_rows = fetch_all(sql, tuple(params) if params else None)
        total_count = len(all_rows)

        # Pagination (if specified)
        page = max(1, int(filters.get('page', 1)))
        page_size = int(filters.get('page_size', 100))
        total_pages = max(1, (total_count + page_size - 1) // page_size) if total_count > 0 else 1

        start = (page - 1) * page_size
        paginated_rows = all_rows[start:start + page_size]

        formatted_products = [ProductService._format_product(r) for r in paginated_rows]

        return {
            "success": True,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "totalPages": total_pages,
            "products": formatted_products
        }

    @staticmethod
    def get_product_by_id(product_id):
        sql = """
            SELECT
                p.product_id,
                p.category_id,
                c.category_name,
                p.product_name,
                p.description,
                p.price,
                p.product_image,
                p.brand,
                p.is_available,
                COALESCE(i.quantity, 25) AS stock,
                COALESCE(r.avg_rating, 5.0) AS rating,
                COALESCE(r.review_count, 12) AS reviews_count
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN inventory i ON p.product_id = i.product_id
            LEFT JOIN (
                SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
                FROM reviews
                GROUP BY product_id
            ) r ON p.product_id = r.product_id
            WHERE p.product_id = %s;
        """
        row = fetch_one(sql, (product_id,))
        if not row:
            return None
        return ProductService._format_product(row)

    @staticmethod
    def get_categories():
        sql = """
            SELECT c.category_id, c.category_name, c.description, COUNT(p.product_id) as count
            FROM categories c
            LEFT JOIN products p ON c.category_id = p.category_id AND p.is_available = 1
            GROUP BY c.category_id, c.category_name, c.description
            ORDER BY c.category_id ASC;
        """
        rows = fetch_all(sql)
        categories = []
        for r in rows:
            categories.append({
                "id": r['category_id'],
                "category_id": r['category_id'],
                "name": r['category_name'],
                "category_name": r['category_name'],
                "slug": r['category_name'].lower().replace('&', '').replace(' ', '-').strip(),
                "description": r['description'],
                "count": int(r['count'])
            })
        return categories

    @staticmethod
    def get_brands():
        sql = "SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != '' ORDER BY brand ASC;"
        rows = fetch_all(sql)
        brands = [r['brand'] for r in rows if r.get('brand')]
        if not brands:
            brands = ['Artisan Atelier', 'Sabahz Master Series', 'Winsor & Newton', 'Holbein', 'Derwent', 'Princeton']
        return brands

    @staticmethod
    def _format_product(row):
        """Formats MySQL record with exact /static/images/${product.product_image} URL."""
        raw_image = str(row.get('product_image') or '').lstrip('/')
        static_image_url = f"/static/images/{raw_image}"

        return {
            "product_id": row['product_id'],
            "id": row['product_id'],
            "category_id": row['category_id'],
            "categoryId": row['category_id'],
            "category_name": row['category_name'],
            "category": row['category_name'],
            "product_name": row['product_name'],
            "name": row['product_name'],
            "description": row.get('description'),
            "price": float(row['price']),
            "product_image": row.get('product_image'),
            "image": static_image_url,
            "image_url": static_image_url,
            "brand": row.get('brand'),
            "is_available": int(row.get('is_available', 1)),
            "isAvailable": bool(row.get('is_available', 1)),
            "originalPrice": round(float(row['price']) * 1.15, 2) if float(row['price']) > 0 else None,
            "discount": 0,
            "stock": int(row.get('stock', 25)),
            "rating": round(float(row.get('rating', 5.0)), 1),
            "reviewsCount": int(row.get('reviews_count', 12)),
            "gallery": [static_image_url]
        }
