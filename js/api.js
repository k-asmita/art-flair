/**
 * Art Flair - Centralized API Layer & Mock Fallback Engine
 * Developed for Sabahz Trading
 * 
 * Provides a standardized HTTP client for communicating with the Python + MySQL backend.
 * Uses Indian Rupees (INR - ₹) as the primary currency across all models and operations.
 */

// Comprehensive Database Mock Catalog (Real artist-grade supplies in INR for Sabahz Trading)
const MOCK_DATABASE_PRODUCTS = [
  {
    "id": "PRO001",
    "product_id": "PRO001",
    "name": "Clay Tools",
    "product_name": "Clay Tools",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/clay-tools.webp",
    "image": "Products/Accessories/clay-tools.webp",
    "image_url": "Products/Accessories/clay-tools.webp",
    "price": 253.0,
    "originalPrice": 290.95,
    "discount": 0,
    "stock": 16,
    "rating": 4.6,
    "reviewsCount": 13,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival clay tools curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO002",
    "product_id": "PRO002",
    "name": "Color Mixing Guide",
    "product_name": "Color Mixing Guide",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/color-mixing-guide.webp",
    "image": "Products/Accessories/color-mixing-guide.webp",
    "image_url": "Products/Accessories/color-mixing-guide.webp",
    "price": 326.0,
    "originalPrice": 374.9,
    "discount": 0,
    "stock": 17,
    "rating": 4.7,
    "reviewsCount": 16,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival color mixing guide curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO003",
    "product_id": "PRO003",
    "name": "Heavy Duty Cutter",
    "product_name": "Heavy Duty Cutter",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/heavy-duty-cutter.webp",
    "image": "Products/Accessories/heavy-duty-cutter.webp",
    "image_url": "Products/Accessories/heavy-duty-cutter.webp",
    "price": 399.0,
    "originalPrice": 458.85,
    "discount": 10,
    "stock": 18,
    "rating": 4.8,
    "reviewsCount": 19,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival heavy duty cutter curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO004",
    "product_id": "PRO004",
    "name": "Hot Glu Gun",
    "product_name": "Hot Glu Gun",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/hot-glu-gun.webp",
    "image": "Products/Accessories/hot-glu-gun.webp",
    "image_url": "Products/Accessories/hot-glu-gun.webp",
    "price": 472.0,
    "originalPrice": 542.8,
    "discount": 0,
    "stock": 19,
    "rating": 4.9,
    "reviewsCount": 22,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival hot glu gun curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO005",
    "product_id": "PRO005",
    "name": "Kneaded Eraser",
    "product_name": "Kneaded Eraser",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/kneaded-eraser.webp",
    "image": "Products/Accessories/kneaded-eraser.webp",
    "image_url": "Products/Accessories/kneaded-eraser.webp",
    "price": 545.0,
    "originalPrice": 626.75,
    "discount": 0,
    "stock": 20,
    "rating": 4.5,
    "reviewsCount": 25,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival kneaded eraser curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO006",
    "product_id": "PRO006",
    "name": "Mechanical Pencil",
    "product_name": "Mechanical Pencil",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/mechanical-pencil.webp",
    "image": "Products/Accessories/mechanical-pencil.webp",
    "image_url": "Products/Accessories/mechanical-pencil.webp",
    "price": 618.0,
    "originalPrice": 710.7,
    "discount": 10,
    "stock": 21,
    "rating": 4.6,
    "reviewsCount": 28,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival mechanical pencil curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO007",
    "product_id": "PRO007",
    "name": "Outliner",
    "product_name": "Outliner",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/outliner.webp",
    "image": "Products/Accessories/outliner.webp",
    "image_url": "Products/Accessories/outliner.webp",
    "price": 691.0,
    "originalPrice": 794.65,
    "discount": 0,
    "stock": 22,
    "rating": 4.7,
    "reviewsCount": 31,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival outliner curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO008",
    "product_id": "PRO008",
    "name": "Palette Knife",
    "product_name": "Palette Knife",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/palette-knife.jpg",
    "image": "Products/Accessories/palette-knife.jpg",
    "image_url": "Products/Accessories/palette-knife.jpg",
    "price": 194.0,
    "originalPrice": 223.1,
    "discount": 0,
    "stock": 23,
    "rating": 4.8,
    "reviewsCount": 34,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival palette knife curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO009",
    "product_id": "PRO009",
    "name": "Paper Blending Stump",
    "product_name": "Paper Blending Stump",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/paper-blending-stump.webp",
    "image": "Products/Accessories/paper-blending-stump.webp",
    "image_url": "Products/Accessories/paper-blending-stump.webp",
    "price": 267.0,
    "originalPrice": 307.05,
    "discount": 10,
    "stock": 24,
    "rating": 4.9,
    "reviewsCount": 37,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival paper blending stump curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO010",
    "product_id": "PRO010",
    "name": "Pencil Eraser Set",
    "product_name": "Pencil Eraser Set",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/pencil-eraser-set.webp",
    "image": "Products/Accessories/pencil-eraser-set.webp",
    "image_url": "Products/Accessories/pencil-eraser-set.webp",
    "price": 340.0,
    "originalPrice": 391.0,
    "discount": 0,
    "stock": 25,
    "rating": 4.5,
    "reviewsCount": 40,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival pencil eraser set curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO011",
    "product_id": "PRO011",
    "name": "Rotary Cutter",
    "product_name": "Rotary Cutter",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/rotary-cutter.jpg",
    "image": "Products/Accessories/rotary-cutter.jpg",
    "image_url": "Products/Accessories/rotary-cutter.jpg",
    "price": 413.0,
    "originalPrice": 474.95,
    "discount": 0,
    "stock": 26,
    "rating": 4.6,
    "reviewsCount": 43,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival rotary cutter curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO012",
    "product_id": "PRO012",
    "name": "Wooden Palette",
    "product_name": "Wooden Palette",
    "category": "Accessories",
    "category_name": "Accessories",
    "categoryId": "accessories",
    "category_id": "accessories",
    "product_image": "products/accessories/wooden-palette.webp",
    "image": "Products/Accessories/wooden-palette.webp",
    "image_url": "Products/Accessories/wooden-palette.webp",
    "price": 486.0,
    "originalPrice": 558.9,
    "discount": 10,
    "stock": 27,
    "rating": 4.7,
    "reviewsCount": 46,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival wooden palette curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Accessories",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO013",
    "product_id": "PRO013",
    "name": "Detailing Set",
    "product_name": "Detailing Set",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/detailing-set.webp",
    "image": "Products/Brushes/detailing-set.webp",
    "image_url": "Products/Brushes/detailing-set.webp",
    "price": 1299.0,
    "originalPrice": 1493.85,
    "discount": 0,
    "stock": 28,
    "rating": 4.8,
    "reviewsCount": 49,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival detailing set curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO014",
    "product_id": "PRO014",
    "name": "Flat Wash Set",
    "product_name": "Flat Wash Set",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/flat-wash-set.webp",
    "image": "Products/Brushes/flat-wash-set.webp",
    "image_url": "Products/Brushes/flat-wash-set.webp",
    "price": 1372.0,
    "originalPrice": 1577.8,
    "discount": 0,
    "stock": 29,
    "rating": 4.9,
    "reviewsCount": 52,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival flat wash set curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO015",
    "product_id": "PRO015",
    "name": "Hog Bristle",
    "product_name": "Hog Bristle",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/hog-bristle.webp",
    "image": "Products/Brushes/hog-bristle.webp",
    "image_url": "Products/Brushes/hog-bristle.webp",
    "price": 1445.0,
    "originalPrice": 1661.75,
    "discount": 10,
    "stock": 30,
    "rating": 4.5,
    "reviewsCount": 55,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival hog bristle curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO016",
    "product_id": "PRO016",
    "name": "Liner Set",
    "product_name": "Liner Set",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/liner-set.webp",
    "image": "Products/Brushes/liner-set.webp",
    "image_url": "Products/Brushes/liner-set.webp",
    "price": 1518.0,
    "originalPrice": 1745.7,
    "discount": 0,
    "stock": 31,
    "rating": 4.6,
    "reviewsCount": 58,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival liner set curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO017",
    "product_id": "PRO017",
    "name": "Mop Brush",
    "product_name": "Mop Brush",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/mop-brush.webp",
    "image": "Products/Brushes/mop-brush.webp",
    "image_url": "Products/Brushes/mop-brush.webp",
    "price": 1591.0,
    "originalPrice": 1829.65,
    "discount": 0,
    "stock": 32,
    "rating": 4.7,
    "reviewsCount": 61,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival mop brush curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO018",
    "product_id": "PRO018",
    "name": "Natural Hair Mop",
    "product_name": "Natural Hair Mop",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/natural-hair-mop.webp",
    "image": "Products/Brushes/natural-hair-mop.webp",
    "image_url": "Products/Brushes/natural-hair-mop.webp",
    "price": 1664.0,
    "originalPrice": 1913.6,
    "discount": 10,
    "stock": 33,
    "rating": 4.8,
    "reviewsCount": 64,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival natural hair mop curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO019",
    "product_id": "PRO019",
    "name": "Nylon Detailing",
    "product_name": "Nylon Detailing",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/nylon-detailing.webp",
    "image": "Products/Brushes/nylon-detailing.webp",
    "image_url": "Products/Brushes/nylon-detailing.webp",
    "price": 1737.0,
    "originalPrice": 1997.55,
    "discount": 0,
    "stock": 34,
    "rating": 4.9,
    "reviewsCount": 67,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival nylon detailing curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO020",
    "product_id": "PRO020",
    "name": "Premium Mix",
    "product_name": "Premium Mix",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/premium-mix.webp",
    "image": "Products/Brushes/premium-mix.webp",
    "image_url": "Products/Brushes/premium-mix.webp",
    "price": 1810.0,
    "originalPrice": 2081.5,
    "discount": 0,
    "stock": 35,
    "rating": 4.5,
    "reviewsCount": 70,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival premium mix curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO021",
    "product_id": "PRO021",
    "name": "Professional Set",
    "product_name": "Professional Set",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/professional-set.webp",
    "image": "Products/Brushes/professional-set.webp",
    "image_url": "Products/Brushes/professional-set.webp",
    "price": 383.0,
    "originalPrice": 440.45,
    "discount": 10,
    "stock": 36,
    "rating": 4.6,
    "reviewsCount": 73,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival professional set curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO022",
    "product_id": "PRO022",
    "name": "Royal Gesso 3",
    "product_name": "Royal Gesso 3",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/royal-gesso-3.webp",
    "image": "Products/Brushes/royal-gesso-3.webp",
    "image_url": "Products/Brushes/royal-gesso-3.webp",
    "price": 456.0,
    "originalPrice": 524.4,
    "discount": 0,
    "stock": 37,
    "rating": 4.7,
    "reviewsCount": 76,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival royal gesso 3 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO023",
    "product_id": "PRO023",
    "name": "Water Brush Pen",
    "product_name": "Water Brush Pen",
    "category": "Brushes",
    "category_name": "Brushes",
    "categoryId": "brushes",
    "category_id": "brushes",
    "product_image": "products/brushes/water-brush-pen.webp",
    "image": "Products/Brushes/water-brush-pen.webp",
    "image_url": "Products/Brushes/water-brush-pen.webp",
    "price": 529.0,
    "originalPrice": 608.35,
    "discount": 0,
    "stock": 38,
    "rating": 4.8,
    "reviewsCount": 79,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival water brush pen curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Brushes",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO024",
    "product_id": "PRO024",
    "name": "Calligraphy1",
    "product_name": "Calligraphy1",
    "category": "Calligraphy",
    "category_name": "Calligraphy",
    "categoryId": "calligraphy",
    "category_id": "calligraphy",
    "product_image": "products/calligraphy/calligraphy1.jpg",
    "image": "Products/Calligraphy/calligraphy1.jpg",
    "image_url": "Products/Calligraphy/calligraphy1.jpg",
    "price": 452.0,
    "originalPrice": 519.8,
    "discount": 10,
    "stock": 39,
    "rating": 4.9,
    "reviewsCount": 82,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival calligraphy1 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Calligraphy",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO025",
    "product_id": "PRO025",
    "name": "Calligraphy2",
    "product_name": "Calligraphy2",
    "category": "Calligraphy",
    "category_name": "Calligraphy",
    "categoryId": "calligraphy",
    "category_id": "calligraphy",
    "product_image": "products/calligraphy/calligraphy2.jpg",
    "image": "Products/Calligraphy/calligraphy2.jpg",
    "image_url": "Products/Calligraphy/calligraphy2.jpg",
    "price": 525.0,
    "originalPrice": 603.75,
    "discount": 0,
    "stock": 40,
    "rating": 4.5,
    "reviewsCount": 85,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival calligraphy2 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Calligraphy",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO026",
    "product_id": "PRO026",
    "name": "Calligraphy3",
    "product_name": "Calligraphy3",
    "category": "Calligraphy",
    "category_name": "Calligraphy",
    "categoryId": "calligraphy",
    "category_id": "calligraphy",
    "product_image": "products/calligraphy/calligraphy3.webp",
    "image": "Products/Calligraphy/calligraphy3.webp",
    "image_url": "Products/Calligraphy/calligraphy3.webp",
    "price": 598.0,
    "originalPrice": 687.7,
    "discount": 0,
    "stock": 41,
    "rating": 4.6,
    "reviewsCount": 88,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival calligraphy3 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Calligraphy",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO027",
    "product_id": "PRO027",
    "name": "Calligraphy4",
    "product_name": "Calligraphy4",
    "category": "Calligraphy",
    "category_name": "Calligraphy",
    "categoryId": "calligraphy",
    "category_id": "calligraphy",
    "product_image": "products/calligraphy/calligraphy4.webp",
    "image": "Products/Calligraphy/calligraphy4.webp",
    "image_url": "Products/Calligraphy/calligraphy4.webp",
    "price": 671.0,
    "originalPrice": 771.65,
    "discount": 10,
    "stock": 42,
    "rating": 4.7,
    "reviewsCount": 91,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival calligraphy4 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Calligraphy",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO028",
    "product_id": "PRO028",
    "name": "Calligraphy5",
    "product_name": "Calligraphy5",
    "category": "Calligraphy",
    "category_name": "Calligraphy",
    "categoryId": "calligraphy",
    "category_id": "calligraphy",
    "product_image": "products/calligraphy/calligraphy5.webp",
    "image": "Products/Calligraphy/calligraphy5.webp",
    "image_url": "Products/Calligraphy/calligraphy5.webp",
    "price": 744.0,
    "originalPrice": 855.6,
    "discount": 0,
    "stock": 43,
    "rating": 4.8,
    "reviewsCount": 94,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival calligraphy5 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Calligraphy",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO029",
    "product_id": "PRO029",
    "name": "Canvas Roll",
    "product_name": "Canvas Roll",
    "category": "Canvas",
    "category_name": "Canvas",
    "categoryId": "canvas",
    "category_id": "canvas",
    "product_image": "products/canvas/canvas-roll.webp",
    "image": "Products/Canvas/canvas-roll.webp",
    "image_url": "Products/Canvas/canvas-roll.webp",
    "price": 2397.0,
    "originalPrice": 2756.55,
    "discount": 0,
    "stock": 44,
    "rating": 4.9,
    "reviewsCount": 97,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival canvas roll curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Canvas",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO030",
    "product_id": "PRO030",
    "name": "Double Primed Board",
    "product_name": "Double Primed Board",
    "category": "Canvas",
    "category_name": "Canvas",
    "categoryId": "canvas",
    "category_id": "canvas",
    "product_image": "products/canvas/double-primed-board.jpg",
    "image": "Products/Canvas/double-primed-board.jpg",
    "image_url": "Products/Canvas/double-primed-board.jpg",
    "price": 350.0,
    "originalPrice": 402.5,
    "discount": 10,
    "stock": 45,
    "rating": 4.5,
    "reviewsCount": 100,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival double primed board curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Canvas",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO031",
    "product_id": "PRO031",
    "name": "Stretched Canvas",
    "product_name": "Stretched Canvas",
    "category": "Canvas",
    "category_name": "Canvas",
    "categoryId": "canvas",
    "category_id": "canvas",
    "product_image": "products/canvas/stretched-canvas.webp",
    "image": "Products/Canvas/stretched-canvas.webp",
    "image_url": "Products/Canvas/stretched-canvas.webp",
    "price": 423.0,
    "originalPrice": 486.45,
    "discount": 0,
    "stock": 46,
    "rating": 4.6,
    "reviewsCount": 103,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival stretched canvas curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Canvas",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO032",
    "product_id": "PRO032",
    "name": "Charcoal Kit",
    "product_name": "Charcoal Kit",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/charcoal-kit.webp",
    "image": "Products/Drawing Media/charcoal-kit.webp",
    "image_url": "Products/Drawing Media/charcoal-kit.webp",
    "price": 1134.0,
    "originalPrice": 1304.1,
    "discount": 0,
    "stock": 47,
    "rating": 4.7,
    "reviewsCount": 106,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival charcoal kit curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO033",
    "product_id": "PRO033",
    "name": "Charcoal Pencil 12",
    "product_name": "Charcoal Pencil 12",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/charcoal-pencil-12.webp",
    "image": "Products/Drawing Media/charcoal-pencil-12.webp",
    "image_url": "Products/Drawing Media/charcoal-pencil-12.webp",
    "price": 1207.0,
    "originalPrice": 1388.05,
    "discount": 10,
    "stock": 48,
    "rating": 4.8,
    "reviewsCount": 109,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival charcoal pencil 12 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO034",
    "product_id": "PRO034",
    "name": "Compressed Charcoal",
    "product_name": "Compressed Charcoal",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/compressed-charcoal.jpg",
    "image": "Products/Drawing Media/compressed-charcoal.jpg",
    "image_url": "Products/Drawing Media/compressed-charcoal.jpg",
    "price": 1280.0,
    "originalPrice": 1472.0,
    "discount": 0,
    "stock": 49,
    "rating": 4.9,
    "reviewsCount": 112,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival compressed charcoal curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO035",
    "product_id": "PRO035",
    "name": "Metallic 50",
    "product_name": "Metallic 50",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/metallic-50.jpg",
    "image": "Products/Drawing Media/metallic-50.jpg",
    "image_url": "Products/Drawing Media/metallic-50.jpg",
    "price": 1353.0,
    "originalPrice": 1555.95,
    "discount": 0,
    "stock": 15,
    "rating": 4.5,
    "reviewsCount": 115,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival metallic 50 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO036",
    "product_id": "PRO036",
    "name": "Oil Coloured 48",
    "product_name": "Oil Coloured 48",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/oil-coloured-48.webp",
    "image": "Products/Drawing Media/oil-coloured-48.webp",
    "image_url": "Products/Drawing Media/oil-coloured-48.webp",
    "price": 1426.0,
    "originalPrice": 1639.9,
    "discount": 10,
    "stock": 16,
    "rating": 4.6,
    "reviewsCount": 118,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival oil coloured 48 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO037",
    "product_id": "PRO037",
    "name": "Oil Pastel 48",
    "product_name": "Oil Pastel 48",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/oil-pastel-48.jpg",
    "image": "Products/Drawing Media/oil-pastel-48.jpg",
    "image_url": "Products/Drawing Media/oil-pastel-48.jpg",
    "price": 1499.0,
    "originalPrice": 1723.85,
    "discount": 0,
    "stock": 17,
    "rating": 4.7,
    "reviewsCount": 121,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival oil pastel 48 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO038",
    "product_id": "PRO038",
    "name": "Skech Kit 50",
    "product_name": "Skech Kit 50",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/skech-kit-50.jpg",
    "image": "Products/Drawing Media/skech-kit-50.jpg",
    "image_url": "Products/Drawing Media/skech-kit-50.jpg",
    "price": 1572.0,
    "originalPrice": 1807.8,
    "discount": 0,
    "stock": 18,
    "rating": 4.8,
    "reviewsCount": 124,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival skech kit 50 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO039",
    "product_id": "PRO039",
    "name": "Soft Core 72",
    "product_name": "Soft Core 72",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/soft-core-72.jpg",
    "image": "Products/Drawing Media/soft-core-72.jpg",
    "image_url": "Products/Drawing Media/soft-core-72.jpg",
    "price": 244.0,
    "originalPrice": 280.6,
    "discount": 10,
    "stock": 19,
    "rating": 4.9,
    "reviewsCount": 127,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival soft core 72 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO040",
    "product_id": "PRO040",
    "name": "Watersoluble Graphite",
    "product_name": "Watersoluble Graphite",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/watersoluble-graphite.webp",
    "image": "Products/Drawing Media/watersoluble-graphite.webp",
    "image_url": "Products/Drawing Media/watersoluble-graphite.webp",
    "price": 317.0,
    "originalPrice": 364.55,
    "discount": 0,
    "stock": 20,
    "rating": 4.5,
    "reviewsCount": 130,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival watersoluble graphite curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO041",
    "product_id": "PRO041",
    "name": "White Charcoal",
    "product_name": "White Charcoal",
    "category": "Drawing Media",
    "category_name": "Drawing Media",
    "categoryId": "drawing-media",
    "category_id": "drawing-media",
    "product_image": "products/drawing-media/white-charcoal.jpg",
    "image": "Products/Drawing Media/white-charcoal.jpg",
    "image_url": "Products/Drawing Media/white-charcoal.jpg",
    "price": 390.0,
    "originalPrice": 448.5,
    "discount": 0,
    "stock": 21,
    "rating": 4.6,
    "reviewsCount": 133,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival white charcoal curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Drawing Media",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO042",
    "product_id": "PRO042",
    "name": "Easel1",
    "product_name": "Easel1",
    "category": "Easels",
    "category_name": "Easels",
    "categoryId": "easels",
    "category_id": "easels",
    "product_image": "products/easels/easel1.webp",
    "image": "Products/Easels/easel1.webp",
    "image_url": "Products/Easels/easel1.webp",
    "price": 3916.0,
    "originalPrice": 4503.4,
    "discount": 10,
    "stock": 22,
    "rating": 4.7,
    "reviewsCount": 136,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival easel1 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Easels",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO043",
    "product_id": "PRO043",
    "name": "Easel2",
    "product_name": "Easel2",
    "category": "Easels",
    "category_name": "Easels",
    "categoryId": "easels",
    "category_id": "easels",
    "product_image": "products/easels/easel2.webp",
    "image": "Products/Easels/easel2.webp",
    "image_url": "Products/Easels/easel2.webp",
    "price": 3989.0,
    "originalPrice": 4587.35,
    "discount": 0,
    "stock": 23,
    "rating": 4.8,
    "reviewsCount": 139,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival easel2 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Easels",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO044",
    "product_id": "PRO044",
    "name": "Easel3",
    "product_name": "Easel3",
    "category": "Easels",
    "category_name": "Easels",
    "categoryId": "easels",
    "category_id": "easels",
    "product_image": "products/easels/easel3.webp",
    "image": "Products/Easels/easel3.webp",
    "image_url": "Products/Easels/easel3.webp",
    "price": 4062.0,
    "originalPrice": 4671.3,
    "discount": 0,
    "stock": 24,
    "rating": 4.9,
    "reviewsCount": 142,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival easel3 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Easels",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO045",
    "product_id": "PRO045",
    "name": "Gesso",
    "product_name": "Gesso",
    "category": "Painting Medium",
    "category_name": "Painting Medium",
    "categoryId": "painting-medium",
    "category_id": "painting-medium",
    "product_image": "products/painting-medium/gesso.webp",
    "image": "Products/Painting Medium/gesso.webp",
    "image_url": "Products/Painting Medium/gesso.webp",
    "price": 795.0,
    "originalPrice": 914.25,
    "discount": 10,
    "stock": 25,
    "rating": 4.5,
    "reviewsCount": 145,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival gesso curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Painting Medium",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO046",
    "product_id": "PRO046",
    "name": "Gloss Medium",
    "product_name": "Gloss Medium",
    "category": "Painting Medium",
    "category_name": "Painting Medium",
    "categoryId": "painting-medium",
    "category_id": "painting-medium",
    "product_image": "products/painting-medium/gloss-medium.webp",
    "image": "Products/Painting Medium/gloss-medium.webp",
    "image_url": "Products/Painting Medium/gloss-medium.webp",
    "price": 868.0,
    "originalPrice": 998.2,
    "discount": 0,
    "stock": 26,
    "rating": 4.6,
    "reviewsCount": 148,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival gloss medium curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Painting Medium",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO047",
    "product_id": "PRO047",
    "name": "Masking Fluid",
    "product_name": "Masking Fluid",
    "category": "Painting Medium",
    "category_name": "Painting Medium",
    "categoryId": "painting-medium",
    "category_id": "painting-medium",
    "product_image": "products/painting-medium/masking-fluid.webp",
    "image": "Products/Painting Medium/masking-fluid.webp",
    "image_url": "Products/Painting Medium/masking-fluid.webp",
    "price": 941.0,
    "originalPrice": 1082.15,
    "discount": 0,
    "stock": 27,
    "rating": 4.7,
    "reviewsCount": 151,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival masking fluid curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Painting Medium",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO048",
    "product_id": "PRO048",
    "name": "Turpentine",
    "product_name": "Turpentine",
    "category": "Painting Medium",
    "category_name": "Painting Medium",
    "categoryId": "painting-medium",
    "category_id": "painting-medium",
    "product_image": "products/painting-medium/turpentine.webp",
    "image": "Products/Painting Medium/turpentine.webp",
    "image_url": "Products/Painting Medium/turpentine.webp",
    "price": 1014.0,
    "originalPrice": 1166.1,
    "discount": 10,
    "stock": 28,
    "rating": 4.8,
    "reviewsCount": 154,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival turpentine curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Painting Medium",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO049",
    "product_id": "PRO049",
    "name": "Acrylic",
    "product_name": "Acrylic",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/acrylic.jpg",
    "image": "Products/Paints/acrylic.jpg",
    "image_url": "Products/Paints/acrylic.jpg",
    "price": 717.0,
    "originalPrice": 824.55,
    "discount": 0,
    "stock": 29,
    "rating": 4.9,
    "reviewsCount": 157,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival acrylic curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO050",
    "product_id": "PRO050",
    "name": "Camel",
    "product_name": "Camel",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/camel.jpg",
    "image": "Products/Paints/camel.jpg",
    "image_url": "Products/Paints/camel.jpg",
    "price": 790.0,
    "originalPrice": 908.5,
    "discount": 0,
    "stock": 30,
    "rating": 4.5,
    "reviewsCount": 160,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival camel curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO051",
    "product_id": "PRO051",
    "name": "Cotman Water Colour",
    "product_name": "Cotman Water Colour",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/cotman-water-colour.jpg",
    "image": "Products/Paints/cotman-water-colour.jpg",
    "image_url": "Products/Paints/cotman-water-colour.jpg",
    "price": 863.0,
    "originalPrice": 992.45,
    "discount": 10,
    "stock": 31,
    "rating": 4.6,
    "reviewsCount": 163,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival cotman water colour curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO052",
    "product_id": "PRO052",
    "name": "Drawing Ink",
    "product_name": "Drawing Ink",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/drawing-ink.jpg",
    "image": "Products/Paints/drawing-ink.jpg",
    "image_url": "Products/Paints/drawing-ink.jpg",
    "price": 936.0,
    "originalPrice": 1076.4,
    "discount": 0,
    "stock": 32,
    "rating": 4.7,
    "reviewsCount": 166,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival drawing ink curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO053",
    "product_id": "PRO053",
    "name": "Fine Water Colour",
    "product_name": "Fine Water Colour",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/fine-water-colour.jpg",
    "image": "Products/Paints/fine-water-colour.jpg",
    "image_url": "Products/Paints/fine-water-colour.jpg",
    "price": 1009.0,
    "originalPrice": 1160.35,
    "discount": 0,
    "stock": 33,
    "rating": 4.8,
    "reviewsCount": 169,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival fine water colour curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO054",
    "product_id": "PRO054",
    "name": "Gouache",
    "product_name": "Gouache",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/gouache.jpg",
    "image": "Products/Paints/gouache.jpg",
    "image_url": "Products/Paints/gouache.jpg",
    "price": 1082.0,
    "originalPrice": 1244.3,
    "discount": 10,
    "stock": 34,
    "rating": 4.9,
    "reviewsCount": 172,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival gouache curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO055",
    "product_id": "PRO055",
    "name": "Oil Colour",
    "product_name": "Oil Colour",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/oil-colour.jpg",
    "image": "Products/Paints/oil-colour.jpg",
    "image_url": "Products/Paints/oil-colour.jpg",
    "price": 1155.0,
    "originalPrice": 1328.25,
    "discount": 0,
    "stock": 35,
    "rating": 4.5,
    "reviewsCount": 175,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival oil colour curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO056",
    "product_id": "PRO056",
    "name": "Pigments",
    "product_name": "Pigments",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/pigments.jpg",
    "image": "Products/Paints/pigments.jpg",
    "image_url": "Products/Paints/pigments.jpg",
    "price": 1228.0,
    "originalPrice": 1412.2,
    "discount": 0,
    "stock": 36,
    "rating": 4.6,
    "reviewsCount": 178,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival pigments curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO057",
    "product_id": "PRO057",
    "name": "Spray",
    "product_name": "Spray",
    "category": "Paints",
    "category_name": "Paints",
    "categoryId": "paints",
    "category_id": "paints",
    "product_image": "products/paints/spray.jpg",
    "image": "Products/Paints/spray.jpg",
    "image_url": "Products/Paints/spray.jpg",
    "price": 1301.0,
    "originalPrice": 1496.15,
    "discount": 10,
    "stock": 37,
    "rating": 4.7,
    "reviewsCount": 181,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival spray curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paints",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO058",
    "product_id": "PRO058",
    "name": "A4 300gsm Pad",
    "product_name": "A4 300gsm Pad",
    "category": "Paper & Pads",
    "category_name": "Paper & Pads",
    "categoryId": "paper-pads",
    "category_id": "paper-pads",
    "product_image": "products/paper-pads/a4-300gsm-pad.jpg",
    "image": "Products/Paper & Pads/a4-300gsm-pad.jpg",
    "image_url": "Products/Paper & Pads/a4-300gsm-pad.jpg",
    "price": 764.0,
    "originalPrice": 878.6,
    "discount": 0,
    "stock": 38,
    "rating": 4.8,
    "reviewsCount": 184,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival a4 300gsm pad curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paper & Pads",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO059",
    "product_id": "PRO059",
    "name": "Art Ranger 200gsm",
    "product_name": "Art Ranger 200gsm",
    "category": "Paper & Pads",
    "category_name": "Paper & Pads",
    "categoryId": "paper-pads",
    "category_id": "paper-pads",
    "product_image": "products/paper-pads/art-ranger-200gsm.jpg",
    "image": "Products/Paper & Pads/art-ranger-200gsm.jpg",
    "image_url": "Products/Paper & Pads/art-ranger-200gsm.jpg",
    "price": 837.0,
    "originalPrice": 962.55,
    "discount": 0,
    "stock": 39,
    "rating": 4.9,
    "reviewsCount": 187,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival art ranger 200gsm curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paper & Pads",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO060",
    "product_id": "PRO060",
    "name": "Canvas Texture",
    "product_name": "Canvas Texture",
    "category": "Paper & Pads",
    "category_name": "Paper & Pads",
    "categoryId": "paper-pads",
    "category_id": "paper-pads",
    "product_image": "products/paper-pads/canvas-texture.webp",
    "image": "Products/Paper & Pads/canvas-texture.webp",
    "image_url": "Products/Paper & Pads/canvas-texture.webp",
    "price": 910.0,
    "originalPrice": 1046.5,
    "discount": 10,
    "stock": 40,
    "rating": 4.5,
    "reviewsCount": 190,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival canvas texture curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paper & Pads",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO061",
    "product_id": "PRO061",
    "name": "Sabahz Watercolor",
    "product_name": "Sabahz Watercolor",
    "category": "Paper & Pads",
    "category_name": "Paper & Pads",
    "categoryId": "paper-pads",
    "category_id": "paper-pads",
    "product_image": "products/paper-pads/sabahz-watercolor.jpg",
    "image": "Products/Paper & Pads/sabahz-watercolor.jpg",
    "image_url": "Products/Paper & Pads/sabahz-watercolor.jpg",
    "price": 983.0,
    "originalPrice": 1130.45,
    "discount": 0,
    "stock": 41,
    "rating": 4.6,
    "reviewsCount": 193,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival sabahz watercolor curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paper & Pads",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO062",
    "product_id": "PRO062",
    "name": "Tear Off Palette",
    "product_name": "Tear Off Palette",
    "category": "Paper & Pads",
    "category_name": "Paper & Pads",
    "categoryId": "paper-pads",
    "category_id": "paper-pads",
    "product_image": "products/paper-pads/tear-off-palette.webp",
    "image": "Products/Paper & Pads/tear-off-palette.webp",
    "image_url": "Products/Paper & Pads/tear-off-palette.webp",
    "price": 1056.0,
    "originalPrice": 1214.4,
    "discount": 0,
    "stock": 42,
    "rating": 4.7,
    "reviewsCount": 196,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival tear off palette curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Paper & Pads",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO063",
    "product_id": "PRO063",
    "name": "Dual Tip 24",
    "product_name": "Dual Tip 24",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/dual-tip-24.webp",
    "image": "Products/Pen & Markers/dual-tip-24.webp",
    "image_url": "Products/Pen & Markers/dual-tip-24.webp",
    "price": 1296.0,
    "originalPrice": 1490.4,
    "discount": 10,
    "stock": 43,
    "rating": 4.8,
    "reviewsCount": 199,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival dual tip 24 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": true,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO064",
    "product_id": "PRO064",
    "name": "Dual Tip Case",
    "product_name": "Dual Tip Case",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/dual-tip-case.webp",
    "image": "Products/Pen & Markers/dual-tip-case.webp",
    "image_url": "Products/Pen & Markers/dual-tip-case.webp",
    "price": 1369.0,
    "originalPrice": 1574.35,
    "discount": 0,
    "stock": 44,
    "rating": 4.9,
    "reviewsCount": 202,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival dual tip case curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO065",
    "product_id": "PRO065",
    "name": "Liquid Chalk",
    "product_name": "Liquid Chalk",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/liquid-chalk.webp",
    "image": "Products/Pen & Markers/liquid-chalk.webp",
    "image_url": "Products/Pen & Markers/liquid-chalk.webp",
    "price": 1442.0,
    "originalPrice": 1658.3,
    "discount": 0,
    "stock": 45,
    "rating": 4.5,
    "reviewsCount": 205,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival liquid chalk curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO066",
    "product_id": "PRO066",
    "name": "Marvy 1",
    "product_name": "Marvy 1",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/marvy-1.webp",
    "image": "Products/Pen & Markers/marvy-1.webp",
    "image_url": "Products/Pen & Markers/marvy-1.webp",
    "price": 1515.0,
    "originalPrice": 1742.25,
    "discount": 10,
    "stock": 46,
    "rating": 4.6,
    "reviewsCount": 208,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival marvy 1 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO067",
    "product_id": "PRO067",
    "name": "Marvy 9",
    "product_name": "Marvy 9",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/marvy-9.webp",
    "image": "Products/Pen & Markers/marvy-9.webp",
    "image_url": "Products/Pen & Markers/marvy-9.webp",
    "price": 1588.0,
    "originalPrice": 1826.2,
    "discount": 0,
    "stock": 47,
    "rating": 4.7,
    "reviewsCount": 211,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival marvy 9 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO068",
    "product_id": "PRO068",
    "name": "Promarker 12",
    "product_name": "Promarker 12",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/promarker-12.jpg",
    "image": "Products/Pen & Markers/promarker-12.jpg",
    "image_url": "Products/Pen & Markers/promarker-12.jpg",
    "price": 1661.0,
    "originalPrice": 1910.15,
    "discount": 0,
    "stock": 48,
    "rating": 4.8,
    "reviewsCount": 214,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival promarker 12 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO069",
    "product_id": "PRO069",
    "name": "Promarker 6",
    "product_name": "Promarker 6",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/promarker-6.jpg",
    "image": "Products/Pen & Markers/promarker-6.jpg",
    "image_url": "Products/Pen & Markers/promarker-6.jpg",
    "price": 1734.0,
    "originalPrice": 1994.1,
    "discount": 10,
    "stock": 49,
    "rating": 4.9,
    "reviewsCount": 217,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival promarker 6 curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO070",
    "product_id": "PRO070",
    "name": "Promarker Skin",
    "product_name": "Promarker Skin",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/promarker-skin.jpg",
    "image": "Products/Pen & Markers/promarker-skin.jpg",
    "image_url": "Products/Pen & Markers/promarker-skin.jpg",
    "price": 1807.0,
    "originalPrice": 2078.05,
    "discount": 0,
    "stock": 15,
    "rating": 4.5,
    "reviewsCount": 220,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival promarker skin curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO071",
    "product_id": "PRO071",
    "name": "Sakura Pigma",
    "product_name": "Sakura Pigma",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/sakura-pigma.webp",
    "image": "Products/Pen & Markers/sakura-pigma.webp",
    "image_url": "Products/Pen & Markers/sakura-pigma.webp",
    "price": 1880.0,
    "originalPrice": 2162.0,
    "discount": 0,
    "stock": 16,
    "rating": 4.6,
    "reviewsCount": 223,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival sakura pigma curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO072",
    "product_id": "PRO072",
    "name": "Sta Acrylic",
    "product_name": "Sta Acrylic",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/sta-acrylic.webp",
    "image": "Products/Pen & Markers/sta-acrylic.webp",
    "image_url": "Products/Pen & Markers/sta-acrylic.webp",
    "price": 1953.0,
    "originalPrice": 2245.95,
    "discount": 10,
    "stock": 17,
    "rating": 4.7,
    "reviewsCount": 226,
    "brand": "Artisan Atelier",
    "description": "Master-grade archival sta acrylic curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": true,
    "isAvailable": true,
    "is_available": true
  },
  {
    "id": "PRO073",
    "product_id": "PRO073",
    "name": "Touch Tool",
    "product_name": "Touch Tool",
    "category": "Pen & Markers",
    "category_name": "Pen & Markers",
    "categoryId": "pen-markers",
    "category_id": "pen-markers",
    "product_image": "products/pen-markers/touch-tool.webp",
    "image": "Products/Pen & Markers/touch-tool.webp",
    "image_url": "Products/Pen & Markers/touch-tool.webp",
    "price": 2026.0,
    "originalPrice": 2329.9,
    "discount": 0,
    "stock": 18,
    "rating": 4.8,
    "reviewsCount": 229,
    "brand": "Sabahz Master Series",
    "description": "Master-grade archival touch tool curated for studio artists and creative disciplines.",
    "specifications": {
      "Medium": "Pen & Markers",
      "Grade": "Artist Archival Grade",
      "Origin": "Sabahz Trading Curated",
      "Safety Standard": "ASTM D-4236 Certified"
    },
    "isFeatured": false,
    "isBestSeller": false,
    "isAvailable": true,
    "is_available": true
  }
];

const MOCK_CATEGORIES = [
  { id: 'accessories', name: 'Accessories', count: 38, icon: 'tool' },
  { id: 'brushes', name: 'Brushes', count: 64, icon: 'brush' },
  { id: 'calligraphy', name: 'Calligraphy', count: 28, icon: 'feather' },
  { id: 'canvas', name: 'Canvas', count: 42, icon: 'layers' },
  { id: 'drawing-media', name: 'Drawing Media', count: 56, icon: 'edit-3' },
  { id: 'easels', name: 'Easels', count: 22, icon: 'layout' },
  { id: 'painting-medium', name: 'Painting Medium', count: 35, icon: 'droplet' },
  { id: 'paints', name: 'Paints', count: 96, icon: 'palette' },
  { id: 'paper-pads', name: 'Paper & Pads', count: 72, icon: 'book-open' },
  { id: 'pen-markers', name: 'Pen & Markers', count: 48, icon: 'pen-tool' }
];

// Fallback brands
const MOCK_BRANDS = [
  'Winsor & Newton',
  'Daniel Smith',
  'Golden',
  'Princeton',
  'Arches',
  'Derwent',
  'Holbein',
  'Gamblin',
  'Da Vinci',
  'Strathmore',
  'Mabef',
  'Art Flair Reserve'
];

/**
 * Centralized API Client Object
 */
const ApiClient = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Session-ID': StorageUtil.getSessionId(),
      ...(options.headers || {})
    };

    const token = StorageUtil.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return this._mockDispatcher(endpoint, config);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.warn(`[Art Flair API] Live request failed for ${url}. Error:`, error.message);
      return this._mockDispatcher(endpoint, config);
    }
  },

  get(endpoint, params = null) {
    let url = endpoint;
    if (params) {
      const cleanParams = {};
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          cleanParams[k] = params[k];
        }
      });
      const query = new URLSearchParams(cleanParams).toString();
      if (query) url = `${endpoint}?${query}`;
    }
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Database Cart & Product Simulation Dispatcher with Full Pagination in INR
  async _mockDispatcher(endpoint, config) {
    await new Promise(resolve => setTimeout(resolve, 80));

    const method = config.method || 'GET';
    const [path, queryString] = endpoint.split('?');
    const queryParams = new URLSearchParams(queryString || '');

    // 1. GET /products
    if (path === API_CONFIG.ENDPOINTS.PRODUCTS && method === 'GET') {
      let results = [...MOCK_DATABASE_PRODUCTS];

      const category = queryParams.get('category');
      if (category && category !== 'all') {
        results = results.filter(p => p.categoryId === category || p.category.toLowerCase().includes(category.toLowerCase()));
      }

      const brand = queryParams.get('brand');
      if (brand && brand !== 'all') {
        results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }

      const search = queryParams.get('q');
      if (search) {
        const q = search.toLowerCase().trim();
        results = results.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.aiTag && p.aiTag.toLowerCase().includes(q))
        );
      }

      const maxPrice = parseFloat(queryParams.get('max_price'));
      if (!isNaN(maxPrice)) {
        results = results.filter(p => {
          const discounted = p.discount > 0 ? p.price * (1 - p.discount/100) : p.price;
          return discounted <= maxPrice;
        });
      }

      const minRating = parseFloat(queryParams.get('min_rating'));
      if (!isNaN(minRating) && minRating > 0) {
        results = results.filter(p => p.rating >= minRating);
      }

      const inStock = queryParams.get('in_stock');
      if (inStock === 'true' || inStock === true) {
        results = results.filter(p => p.stock > 0);
      }

      const sort = queryParams.get('sort') || 'featured';
      if (sort === 'price_asc') {
        results.sort((a, b) => (a.price * (1 - (a.discount||0)/100)) - (b.price * (1 - (b.discount||0)/100)));
      } else if (sort === 'price_desc') {
        results.sort((a, b) => (b.price * (1 - (b.discount||0)/100)) - (a.price * (1 - (a.discount||0)/100)));
      } else if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        results.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      } else if (sort === 'popularity') {
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }

      const total = results.length;
      const page = Math.max(1, parseInt(queryParams.get('page'), 10) || 1);
      const pageSize = Math.max(1, parseInt(queryParams.get('page_size'), 10) || 8);
      const totalPages = Math.ceil(total / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const paginatedProducts = results.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        total,
        page,
        pageSize,
        totalPages,
        products: paginatedProducts
      };
    }

    // 1b. GET /search (Dedicated Search Endpoint with Multi-attribute Ranking & Future NLP Metadata)
    if (path === API_CONFIG.ENDPOINTS.SEARCH && method === 'GET') {
      const q = (queryParams.get('q') || '').toLowerCase().trim();
      let results = [...MOCK_DATABASE_PRODUCTS];

      if (q) {
        results = results.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.specifications && Object.values(p.specifications).some(val => String(val).toLowerCase().includes(q))) ||
          (p.aiTag && p.aiTag.toLowerCase().includes(q))
        );
      }

      const total = results.length;
      return {
        success: true,
        query: q,
        total,
        provider: 'standard-keyword', // Future NLP hook: can be upgraded to 'nlp-semantic'
        isSemantic: false,
        results
      };
    }

    // 1c. GET /search/suggestions (Autocomplete Suggestions)
    if (path === API_CONFIG.ENDPOINTS.SEARCH_SUGGESTIONS && method === 'GET') {
      const q = (queryParams.get('q') || '').toLowerCase().trim();
      if (!q || q.length < 2) {
        return { success: true, query: q, suggestions: [] };
      }

      const suggestions = [];
      // Category matches
      MOCK_CATEGORIES.forEach(c => {
        if (c.name.toLowerCase().includes(q)) {
          suggestions.push({ type: 'category', text: c.name, id: c.id });
        }
      });

      // Product matches
      MOCK_DATABASE_PRODUCTS.forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) {
          suggestions.push({
            type: 'product',
            text: p.name,
            id: p.id,
            brand: p.brand,
            category: p.category,
            price: p.price,
            discount: p.discount,
            image: p.image
          });
        }
      });

      return {
        success: true,
        query: q,
        suggestions: suggestions.slice(0, 6)
      };
    }

    // 2. GET /products/:id
    if (path.startsWith('/products/') && method === 'GET' && !path.includes('featured') && !path.includes('best-sellers') && !path.includes('ai-recommendations')) {
      const id = path.replace('/products/', '');
      const product = MOCK_DATABASE_PRODUCTS.find(p => p.id === id);
      if (product) {
        return { success: true, product };
      }
      return { success: false, message: 'Product not found' };
    }

    // 3. GET /products/featured
    if (path === API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS) {
      const featured = MOCK_DATABASE_PRODUCTS.filter(p => p.isFeatured);
      return { success: true, products: featured };
    }

    // 4. GET /products/best-sellers
    if (path === API_CONFIG.ENDPOINTS.BEST_SELLERS) {
      const best = MOCK_DATABASE_PRODUCTS.filter(p => p.isBestSeller);
      return { success: true, products: best };
    }

    // 5. GET /categories
    if (path === API_CONFIG.ENDPOINTS.CATEGORIES) {
      return { success: true, categories: MOCK_CATEGORIES };
    }

    // 6. GET /brands
    if (path === API_CONFIG.ENDPOINTS.BRANDS) {
      return { success: true, brands: MOCK_BRANDS };
    }

    // 7. GET /products/:id/ai-recommendations & /recommendations/products/:id
    if (path.includes('/ai-recommendations') || path.startsWith('/recommendations/products/')) {
      const id = path.includes('/ai-recommendations') ? path.split('/')[2] : path.replace('/recommendations/products/', '');
      const current = MOCK_DATABASE_PRODUCTS.find(p => p.id === id);
      const recs = MOCK_DATABASE_PRODUCTS.filter(p => p.id !== id).slice(0, 4);
      return {
        success: true,
        isPersonalized: true,
        algorithm: 'Pigment Affinity Matrix & Medium Complementarity Graph v2.4',
        recommendations: recs,
        aiInsight: `Based on your selection of ${current?.name || 'this medium'}, our AI pairing model suggests complementary tools and archival supports for optimal paint adhesion and lightfastness.`
      };
    }

    // 7b. GET /recommendations/user (Personalized for Authenticated Patron vs Cold-Start for New Users)
    if (path === API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS_USER && method === 'GET') {
      const user = StorageUtil.getUser();
      const isAuthenticated = user && !user.isGuest;
      const history = StorageUtil.getHistory() || [];

      // Check if user has sufficient browsing / purchase interaction history
      if (isAuthenticated || history.length >= 2) {
        // ML Neural Collaborative Filtering Result
        const personalizedItems = MOCK_DATABASE_PRODUCTS.slice(0, 4);
        return {
          success: true,
          isPersonalized: true,
          hasSufficientData: true,
          algorithm: 'Deep Matrix Factorization & Atelier Medium Affinity',
          recommendations: personalizedItems,
          rationale: 'Personalized based on your atelier browsing history and archival pigment preferences.'
        };
      } else {
        // Cold-start / New user with insufficient interaction data
        const baselineItems = MOCK_DATABASE_PRODUCTS.slice(2, 6);
        return {
          success: true,
          isPersonalized: false,
          hasSufficientData: false,
          message: 'Explore more products to receive personalized recommendations.',
          recommendations: baselineItems,
          rationale: 'Curated Studio Essentials (Popularity Baseline)'
        };
      }
    }

    // 8. DATABASE-DRIVEN CART EMULATION IN INR
    let mockCart = [];
    try {
      mockCart = JSON.parse(localStorage.getItem(StorageUtil.KEYS.DEV_MOCK_CART) || '[]');
    } catch(e) {
      mockCart = [];
    }

    const saveMockCart = (items) => {
      localStorage.setItem(StorageUtil.KEYS.DEV_MOCK_CART, JSON.stringify(items));
    };

    // GET /cart
    if (path === API_CONFIG.ENDPOINTS.GET_CART && method === 'GET') {
      const subtotal = mockCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = 0;
      const shipping = subtotal >= API_CONFIG.SHIPPING.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : API_CONFIG.SHIPPING.STANDARD_SHIPPING_FEE;
      const tax = (subtotal - discount) * API_CONFIG.SHIPPING.TAX_RATE;
      const total = subtotal - discount + shipping + tax;

      return {
        success: true,
        items: mockCart,
        summary: {
          itemCount: mockCart.reduce((count, item) => count + item.quantity, 0),
          subtotal: Number(subtotal.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          total: Number(total.toFixed(2)),
          freeShippingThreshold: API_CONFIG.SHIPPING.FREE_SHIPPING_THRESHOLD,
          remainingForFreeShipping: Math.max(0, API_CONFIG.SHIPPING.FREE_SHIPPING_THRESHOLD - subtotal)
        }
      };
    }

    // POST /cart/add
    if (path === API_CONFIG.ENDPOINTS.ADD_TO_CART && method === 'POST') {
      const body = JSON.parse(config.body || '{}');
      const product = MOCK_DATABASE_PRODUCTS.find(p => p.id === body.productId);
      if (!product) {
        return { success: false, message: 'Product invalid' };
      }

      const existingIndex = mockCart.findIndex(item => item.productId === body.productId);
      const quantityToAdd = body.quantity || 1;

      if (existingIndex > -1) {
        mockCart[existingIndex].quantity += quantityToAdd;
      } else {
        const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        mockCart.push({
          cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          productId: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: Number(discountedPrice.toFixed(2)),
          originalPrice: product.price,
          image: product.image,
          quantity: quantityToAdd,
          stock: product.stock
        });
      }

      saveMockCart(mockCart);
      return { success: true, message: 'Added to cart successfully', items: mockCart };
    }

    // PUT /cart/items/:id
    if (path.startsWith('/cart/items/') && method === 'PUT') {
      const itemId = path.replace('/cart/items/', '');
      const body = JSON.parse(config.body || '{}');
      const item = mockCart.find(i => i.cartItemId === itemId);
      if (item) {
        item.quantity = Math.max(1, body.quantity || 1);
        saveMockCart(mockCart);
        return { success: true, items: mockCart };
      }
      return { success: false, message: 'Item not in cart' };
    }

    // DELETE /cart/items/:id
    if (path.startsWith('/cart/items/') && method === 'DELETE') {
      const itemId = path.replace('/cart/items/', '');
      mockCart = mockCart.filter(i => i.cartItemId !== itemId);
      saveMockCart(mockCart);
      return { success: true, message: 'Item removed', items: mockCart };
    }

    // POST /cart/clear
    if (path === API_CONFIG.ENDPOINTS.CLEAR_CART) {
      mockCart = [];
      saveMockCart(mockCart);
      return { success: true, message: 'Cart cleared', items: [] };
    }

    // POST /orders/checkout (Authoritative Backend Validation)
    if (path === API_CONFIG.ENDPOINTS.CHECKOUT && method === 'POST') {
      const body = JSON.parse(config.body || '{}');
      
      if (!body.items || body.items.length === 0) {
        return { success: false, message: 'Cannot process order: studio cart is empty' };
      }

      if (!body.customer || !body.customer.firstName || !body.customer.email) {
        return { success: false, message: 'Invalid customer contact information provided' };
      }

      if (!body.shippingAddress || !body.shippingAddress.address || !body.shippingAddress.city) {
        return { success: false, message: 'Invalid delivery address provided' };
      }

      // Backend recalculates authoritative prices and validates stock from database
      let backendSubtotal = 0;
      for (const item of body.items) {
        const dbProduct = MOCK_DATABASE_PRODUCTS.find(p => p.id === item.productId || p.id === item.id);
        if (dbProduct) {
          if (dbProduct.stock < item.quantity) {
            return {
              success: false,
              message: `Stock validation failed for ${dbProduct.name}. Only ${dbProduct.stock} units available.`
            };
          }
          const price = dbProduct.discount > 0 ? (dbProduct.price * (1 - dbProduct.discount / 100)) : dbProduct.price;
          backendSubtotal += price * item.quantity;
        } else {
          backendSubtotal += (item.price * item.quantity);
        }
      }

      const shipping = backendSubtotal >= API_CONFIG.SHIPPING.FREE_SHIPPING_THRESHOLD ? 0 : API_CONFIG.SHIPPING.STANDARD_SHIPPING_FEE;
      const tax = backendSubtotal * API_CONFIG.SHIPPING.TAX_RATE;
      const verifiedTotal = Number((backendSubtotal + shipping + tax).toFixed(2));

      const orderId = 'AF-ORD-' + Math.floor(100000 + Math.random() * 900000);
      mockCart = [];
      saveMockCart(mockCart);

      return {
        success: true,
        orderId,
        orderDate: new Date().toISOString(),
        customer: body.customer,
        shippingAddress: body.shippingAddress,
        itemsCount: body.items.length,
        subtotal: backendSubtotal,
        shippingFee: shipping,
        taxAmount: tax,
        total: verifiedTotal,
        paymentMethod: body.paymentMethod || 'upi',
        status: 'Verified & Confirmed for Sabahz Priority Dispatch'
      };
    }

    // 9. DATABASE-DRIVEN WISHLIST EMULATION IN INR
    let mockWishlist = [];
    try {
      mockWishlist = JSON.parse(localStorage.getItem('af_dev_mock_wishlist') || '[]');
    } catch(e) {
      mockWishlist = [];
    }

    const saveMockWishlist = (items) => {
      localStorage.setItem('af_dev_mock_wishlist', JSON.stringify(items));
    };

    // GET /wishlist
    if (path === API_CONFIG.ENDPOINTS.GET_WISHLIST && method === 'GET') {
      return {
        success: true,
        count: mockWishlist.length,
        items: mockWishlist
      };
    }

    // POST /wishlist/add
    if (path === API_CONFIG.ENDPOINTS.ADD_TO_WISHLIST && method === 'POST') {
      const body = JSON.parse(config.body || '{}');
      const product = MOCK_DATABASE_PRODUCTS.find(p => p.id === body.productId);
      if (!product) {
        return { success: false, message: 'Product not found in database' };
      }

      const exists = mockWishlist.some(item => item.id === product.id);
      if (!exists) {
        const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        mockWishlist.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          discount: product.discount,
          discountedPrice: Number(discountedPrice.toFixed(2)),
          stock: product.stock,
          image: product.image,
          rating: product.rating,
          addedDate: new Date().toISOString()
        });
        saveMockWishlist(mockWishlist);
      }

      return {
        success: true,
        message: 'Added to wishlist',
        count: mockWishlist.length,
        items: mockWishlist
      };
    }

    // DELETE /wishlist/items/:id
    if (path.startsWith('/wishlist/items/') && method === 'DELETE') {
      const productId = path.replace('/wishlist/items/', '');
      mockWishlist = mockWishlist.filter(item => item.id !== productId);
      saveMockWishlist(mockWishlist);
      return {
        success: true,
        message: 'Removed from wishlist',
        count: mockWishlist.length,
        items: mockWishlist
      };
    }

    // POST /wishlist/clear
    if (path === API_CONFIG.ENDPOINTS.CLEAR_WISHLIST && method === 'POST') {
      mockWishlist = [];
      saveMockWishlist(mockWishlist);
      return {
        success: true,
        message: 'Wishlist cleared',
        count: 0,
        items: []
      };
    }

    // 10. DATABASE-DRIVEN ORDERS EMULATION IN INR
    let mockOrders = [];
    try {
      mockOrders = JSON.parse(localStorage.getItem('af_dev_mock_orders') || '[]');
      if (mockOrders.length === 0) {
        // Realistic initial order history for authenticated artist
        mockOrders = [
          {
            orderId: 'AF-ORD-948210',
            orderDate: '2026-08-28T14:32:00.000Z',
            status: 'Delivered',
            paymentStatus: 'Paid',
            paymentMethod: 'UPI (Google Pay)',
            total: 7349.00,
            subtotal: 6499.00,
            shippingFee: 0,
            taxAmount: 850.00,
            customer: {
              firstName: 'Aarav',
              lastName: 'Sharma',
              email: 'aarav.art@studio.com',
              phone: '+91 98765 43210'
            },
            shippingAddress: {
              address: 'Lotus Fine Arts Studio, 402 MG Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
              country: 'India'
            },
            items: [
              {
                id: 'AF-OIL-001',
                name: 'Winsor & Newton Artists\' Oil Colour Set (10 x 37ml)',
                price: 4249.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
              },
              {
                id: 'AF-PAP-005',
                name: 'Arches 100% Cotton Watercolor Paper Block (140lb Cold Press 9x12")',
                price: 2250.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
              }
            ]
          },
          {
            orderId: 'AF-ORD-719342',
            orderDate: '2026-09-02T09:15:00.000Z',
            status: 'Shipped',
            paymentStatus: 'Paid',
            paymentMethod: 'Credit Card (Visa)',
            total: 1850.00,
            subtotal: 1850.00,
            shippingFee: 0,
            taxAmount: 0,
            customer: {
              firstName: 'Aarav',
              lastName: 'Sharma',
              email: 'aarav.art@studio.com',
              phone: '+91 98765 43210'
            },
            shippingAddress: {
              address: 'Lotus Fine Arts Studio, 402 MG Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
              country: 'India'
            },
            items: [
              {
                id: 'AF-WTR-002',
                name: 'Daniel Smith Extra Fine Watercolor 15ml - Lapis Lazuli Genuine',
                price: 1850.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80'
              }
            ]
          }
        ];
        localStorage.setItem('af_dev_mock_orders', JSON.stringify(mockOrders));
      }
    } catch(e) {
      mockOrders = [];
    }

    // GET /orders
    if (path === API_CONFIG.ENDPOINTS.GET_ORDERS && method === 'GET') {
      return {
        success: true,
        count: mockOrders.length,
        orders: mockOrders
      };
    }

    // GET /orders/:id
    if (path.startsWith('/orders/') && method === 'GET' && !path.includes('checkout')) {
      const orderId = path.replace('/orders/', '');
      const order = mockOrders.find(o => o.orderId === orderId);
      if (order) {
        return { success: true, order };
      }
      return { success: false, message: 'Order reference not found' };
    }

    // 11. PROFILE ENDPOINTS
    // GET /auth/profile
    if (path === API_CONFIG.ENDPOINTS.USER_PROFILE && method === 'GET') {
      let profile = {
        name: 'Aarav Sharma',
        email: 'aarav.art@studio.com',
        phone: '+91 98765 43210',
        address: 'Lotus Fine Arts Studio, 402 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        memberSince: '2025-11-10',
        artDiscipline: 'Oil Realism & Watercolors',
        tier: 'Sabahz Master Atelier Patron'
      };

      try {
        const saved = JSON.parse(localStorage.getItem('af_dev_mock_profile') || 'null');
        if (saved) profile = { ...profile, ...saved };
      } catch(e) {}

      return {
        success: true,
        user: profile
      };
    }

    // PUT /auth/profile
    if (path === API_CONFIG.ENDPOINTS.UPDATE_PROFILE && method === 'PUT') {
      const body = JSON.parse(config.body || '{}');
      let current = {};
      try {
        current = JSON.parse(localStorage.getItem('af_dev_mock_profile') || '{}');
      } catch(e) {}

      const updated = { ...current, ...body };
      localStorage.setItem('af_dev_mock_profile', JSON.stringify(updated));

      // Also sync currentUser in storage
      const user = StorageUtil.getUser() || {};
      StorageUtil.setUser({ ...user, name: updated.name || user.name, email: updated.email || user.email });

      return {
        success: true,
        message: 'Studio profile updated successfully',
        user: updated
      };
    }

    // =========================================================================
    // 12. ADMIN MANAGEMENT BACKEND API EMULATION (Dynamic Database Sync)
    // =========================================================================
    
    // Dynamic Products Store for Admin CRUD
    let adminProducts = [];
    try {
      adminProducts = JSON.parse(localStorage.getItem('af_dev_mock_products') || '[]');
      if (adminProducts.length === 0) {
        adminProducts = [...MOCK_DATABASE_PRODUCTS];
        localStorage.setItem('af_dev_mock_products', JSON.stringify(adminProducts));
      }
    } catch(e) {
      adminProducts = [...MOCK_DATABASE_PRODUCTS];
    }

    const saveAdminProducts = (prods) => {
      localStorage.setItem('af_dev_mock_products', JSON.stringify(prods));
    };

    // Dynamic Customers Store for Admin
    let adminCustomers = [];
    try {
      adminCustomers = JSON.parse(localStorage.getItem('af_dev_mock_customers') || '[]');
      if (adminCustomers.length === 0) {
        adminCustomers = [
          {
            id: 'CUST-101',
            name: 'Aarav Sharma',
            email: 'aarav.art@studio.com',
            phone: '+91 98765 43210',
            discipline: 'Oil Realism & Watercolors',
            city: 'Mumbai',
            state: 'Maharashtra',
            ordersCount: 2,
            totalSpent: 9199.00,
            joinedDate: '2025-11-10',
            status: 'Active Atelier'
          },
          {
            id: 'CUST-102',
            name: 'Priyanka Patel',
            email: 'priyanka.patel@designart.in',
            phone: '+91 98220 11223',
            discipline: 'Calligraphy & Gouache',
            city: 'Ahmedabad',
            state: 'Gujarat',
            ordersCount: 4,
            totalSpent: 14850.00,
            joinedDate: '2025-12-04',
            status: 'Active Atelier'
          },
          {
            id: 'CUST-103',
            name: 'Vikramaditya Rao',
            email: 'vikram.atelier@bangalore.art',
            phone: '+91 97410 88990',
            discipline: 'Impasto Acrylics & Canvas',
            city: 'Bengaluru',
            state: 'Karnataka',
            ordersCount: 1,
            totalSpent: 5998.00,
            joinedDate: '2026-01-18',
            status: 'Active Atelier'
          },
          {
            id: 'CUST-104',
            name: 'Ananya Deshmukh',
            email: 'ananya.paints@pune.org',
            phone: '+91 91580 44556',
            discipline: 'Drawing Media & Botanical Art',
            city: 'Pune',
            state: 'Maharashtra',
            ordersCount: 3,
            totalSpent: 8740.00,
            joinedDate: '2026-02-02',
            status: 'Active Atelier'
          }
        ];
        localStorage.setItem('af_dev_mock_customers', JSON.stringify(adminCustomers));
      }
    } catch(e) {
      adminCustomers = [];
    }

    // A. GET /admin/stats
    if (path === API_CONFIG.ENDPOINTS.ADMIN_STATS && method === 'GET') {
      const totalRevenue = mockOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lowStockList = adminProducts.filter(p => Number(p.stock) <= 10);

      return {
        success: true,
        stats: {
          totalProducts: adminProducts.length,
          totalCustomers: adminCustomers.length,
          totalOrders: mockOrders.length,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          lowStockCount: lowStockList.length,
          lowStockProducts: lowStockList.slice(0, 5),
          recentOrders: mockOrders.slice(0, 5)
        }
      };
    }

    // B. GET /admin/products
    if (path === API_CONFIG.ENDPOINTS.ADMIN_PRODUCTS && method === 'GET') {
      const q = (queryParams.get('q') || '').toLowerCase().trim();
      const category = queryParams.get('category') || 'all';

      let filtered = [...adminProducts];
      if (category !== 'all') {
        filtered = filtered.filter(p => p.categoryId === category || p.category.toLowerCase() === category.toLowerCase());
      }
      if (q) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
      }

      return {
        success: true,
        total: filtered.length,
        products: filtered
      };
    }

    // C. POST /admin/products (Add new fine art supply)
    if (path === API_CONFIG.ENDPOINTS.ADMIN_PRODUCTS && method === 'POST') {
      const body = JSON.parse(config.body || '{}');
      if (!body.name || !body.price) {
        return { success: false, message: 'Product name and price are required' };
      }

      const categoryName = body.category || 'Paints';
      const categoryId = body.categoryId || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newId = 'AF-' + (body.categoryId ? body.categoryId.substring(0, 3).toUpperCase() : 'ART') + '-' + Math.floor(100 + Math.random() * 900);

      const newProduct = {
        id: newId,
        name: body.name,
        category: categoryName,
        categoryId: categoryId,
        brand: body.brand || 'Art Flair Reserve',
        price: parseFloat(body.price) || 0,
        discount: parseFloat(body.discount) || 0,
        stock: parseInt(body.stock, 10) || 0,
        rating: 5.0,
        reviewsCount: 1,
        isFeatured: !!body.isFeatured,
        isBestSeller: !!body.isBestSeller,
        popularity: 80,
        aiTag: body.aiTag || 'Archival Studio Select',
        image: body.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
        description: body.description || 'Master grade archival material certified for professional artists.',
        specifications: body.specifications || {
          'Origin': body.origin || 'Imported / Certified',
          'Grade': 'Professional Atelier Grade'
        },
        createdDate: new Date().toISOString().split('T')[0]
      };

      adminProducts.unshift(newProduct);
      saveAdminProducts(adminProducts);

      return {
        success: true,
        message: 'Product added successfully to database',
        product: newProduct
      };
    }

    // D. PUT /admin/products/:id
    if (path.startsWith('/admin/products/') && method === 'PUT') {
      const id = path.replace('/admin/products/', '');
      const body = JSON.parse(config.body || '{}');
      const index = adminProducts.findIndex(p => p.id === id);

      if (index === -1) {
        return { success: false, message: 'Product not found' };
      }

      adminProducts[index] = {
        ...adminProducts[index],
        ...body,
        price: body.price !== undefined ? parseFloat(body.price) : adminProducts[index].price,
        discount: body.discount !== undefined ? parseFloat(body.discount) : adminProducts[index].discount,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : adminProducts[index].stock
      };

      saveAdminProducts(adminProducts);
      return {
        success: true,
        message: 'Product updated successfully in database',
        product: adminProducts[index]
      };
    }

    // E. DELETE /admin/products/:id
    if (path.startsWith('/admin/products/') && method === 'DELETE') {
      const id = path.replace('/admin/products/', '');
      const prevLength = adminProducts.length;
      adminProducts = adminProducts.filter(p => p.id !== id);

      if (adminProducts.length === prevLength) {
        return { success: false, message: 'Product not found for deletion' };
      }

      saveAdminProducts(adminProducts);
      return {
        success: true,
        message: 'Product removed from database catalog'
      };
    }

    // F. GET /admin/inventory
    if (path === API_CONFIG.ENDPOINTS.ADMIN_INVENTORY && method === 'GET') {
      const items = adminProducts.map(p => {
        const stock = Number(p.stock) || 0;
        let status = 'In Stock';
        if (stock === 0) status = 'Out of Stock';
        else if (stock <= 10) status = 'Low Stock';

        return {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          stock: stock,
          threshold: 10,
          status: status,
          image: p.image
        };
      });

      return {
        success: true,
        total: items.length,
        inventory: items
      };
    }

    // G. PUT /admin/inventory/:id (Quick Stock Level Update)
    if (path.startsWith('/admin/inventory/') && method === 'PUT') {
      const id = path.replace('/admin/inventory/', '');
      const body = JSON.parse(config.body || '{}');
      const prod = adminProducts.find(p => p.id === id);

      if (!prod) {
        return { success: false, message: 'Inventory item not found' };
      }

      prod.stock = Math.max(0, parseInt(body.stock, 10) || 0);
      saveAdminProducts(adminProducts);

      return {
        success: true,
        message: 'Inventory stock level updated',
        stock: prod.stock
      };
    }

    // H. GET /admin/orders
    if (path === API_CONFIG.ENDPOINTS.ADMIN_ORDERS && method === 'GET') {
      return {
        success: true,
        count: mockOrders.length,
        orders: mockOrders
      };
    }

    // I. PUT /admin/orders/:id/status (Authorized Status Update)
    if (path.includes('/admin/orders/') && path.endsWith('/status') && method === 'PUT') {
      const orderId = path.split('/')[3];
      const body = JSON.parse(config.body || '{}');
      const order = mockOrders.find(o => o.orderId === orderId);

      if (!order) {
        return { success: false, message: 'Order reference not found' };
      }

      order.status = body.status || order.status;
      localStorage.setItem('af_dev_mock_orders', JSON.stringify(mockOrders));

      return {
        success: true,
        message: `Order ${orderId} updated to ${order.status}`,
        order
      };
    }

    // J. GET /admin/customers
    if (path === API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS && method === 'GET') {
      return {
        success: true,
        count: adminCustomers.length,
        customers: adminCustomers
      };
    }

    // K. GET /admin/analytics (Backend Analytics Data)
    if (path === API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS && method === 'GET') {
      const totalRevenue = mockOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      // Category Performance Breakdown
      const categorySales = {};
      adminProducts.forEach(p => {
        categorySales[p.category] = (categorySales[p.category] || 0) + (p.popularity || 50);
      });

      const categoryPerformance = Object.keys(categorySales).map(cat => ({
        category: cat,
        score: categorySales[cat],
        productCount: adminProducts.filter(p => p.category === cat).length
      })).sort((a, b) => b.score - a.score);

      // Popular Products
      const popularProducts = [...adminProducts]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          salesVolume: Math.round((p.popularity || 80) * 1.5),
          revenue: Math.round(((p.popularity || 80) * 1.5) * p.price),
          image: p.image
        }));

      // Customer Preferences
      const customerPreferences = [
        { discipline: 'Oil Painting & Realism', percentage: 38 },
        { discipline: 'Watercolors & Botanical', percentage: 26 },
        { discipline: 'Heavy Acrylics & Mixed Media', percentage: 18 },
        { discipline: 'Calligraphy & Fine Lettering', percentage: 11 },
        { discipline: 'Drawing Media & Graphite', percentage: 7 }
      ];

      // Sales Trends
      const salesTrends = [
        { month: 'Apr 2026', revenue: 64200, orders: 14 },
        { month: 'May 2026', revenue: 78500, orders: 18 },
        { month: 'Jun 2026', revenue: 92100, orders: 22 },
        { month: 'Jul 2026', revenue: 108400, orders: 25 },
        { month: 'Aug 2026', revenue: 124800, orders: 29 },
        { month: 'Sep 2026 (MTD)', revenue: totalRevenue > 0 ? totalRevenue : 42900, orders: mockOrders.length > 0 ? mockOrders.length : 12 }
      ];

      return {
        success: true,
        analytics: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders: mockOrders.length,
          categoryPerformance,
          popularProducts,
          customerPreferences,
          salesTrends
        }
      };
    }

    // L. POST /admin/upload-image (Simulated backend file upload)
    if (path === API_CONFIG.ENDPOINTS.ADMIN_UPLOAD_IMAGE && method === 'POST') {
      const body = JSON.parse(config.body || '{}');
      const imageData = body.dataUrl || body.imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80';
      
      return {
        success: true,
        message: 'Image processed and securely hosted on Sabahz Storage',
        url: imageData
      };
    }

    return { success: true, message: 'Operation processed' };
  }
};
