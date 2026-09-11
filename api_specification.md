# Art Flair — Frontend-Backend API Integration Specification
**Client Organization**: Sabahz Trading  
**Target Backend**: Python (Flask / FastAPI / Django REST Framework)  
**Database**: MySQL  
**Base URL**: `http://localhost:5000/api` (Configurable via `js/config.js`)  
**Store Currency**: Indian Rupees (`₹` / INR)  

---

## 🔐 Global Authentication & Header Conventions

All authenticated requests transmit the JWT Bearer token in the standard HTTP `Authorization` header:

```http
Authorization: Bearer <jwt_token_string>
Content-Type: application/json
Accept: application/json
```

### Standard Error Response Format
All failing endpoints must return a standardized JSON envelope with appropriate HTTP status codes (400, 401, 403, 404, 409, 422, 500):

```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "errors": {
    "field_name": "Specific validation failure message"
  },
  "code": "ERROR_CODE_IDENTIFIER"
}
```

---

## 1. Authentication & Session Endpoints

### 1.1 Patron Login
- **HTTP Method**: `POST`
- **Endpoint**: `/auth/login`
- **Auth Requirement**: Public
- **Request Parameters**: None
- **Request Body**:
```json
{
  "email": "artist.patron@studio.com",
  "password": "masterpiece2026",
  "rememberMe": true
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "CUST-104",
    "name": "Aarav Sharma",
    "email": "artist.patron@studio.com",
    "phone": "+91 98765 43210",
    "role": "customer",
    "discipline": "Oil Painting & Mineral Glazes",
    "isGuest": false
  }
}
```
- **Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid email or password credentials."
}
```
- **Frontend Function / File**: `AuthService.login()` in `js/services/authService.js` / `loginUser()` in `js/auth.js`.

---

### 1.2 Patron Registration
- **HTTP Method**: `POST`
- **Endpoint**: `/auth/register`
- **Auth Requirement**: Public
- **Request Parameters**: None
- **Request Body**:
```json
{
  "name": "Priya Sen",
  "email": "priya.sen@fineart.org",
  "password": "SecurePassword2026",
  "confirmPassword": "SecurePassword2026"
}
```
- **Expected Success Response (201 Created)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "CUST-105",
    "name": "Priya Sen",
    "email": "priya.sen@fineart.org",
    "role": "customer",
    "isGuest": false
  }
}
```
- **Error Response (409 Conflict)**:
```json
{
  "success": false,
  "message": "An atelier account with this email address already exists."
}
```
- **Frontend Function / File**: `AuthService.register()` in `js/services/authService.js` / `registerUser()` in `js/auth.js`.

---

### 1.3 Patron Logout
- **HTTP Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Request Parameters**: None
- **Request Body**: None
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully signed out of Art Flair Studio session."
}
```
- **Frontend Function / File**: `AuthService.logout()` in `js/services/authService.js` / `logoutUser()` in `js/auth.js`.

---

## 2. Product Catalog & Categories Endpoints

### 2.1 Get Products List (Catalog Filtering & Pagination)
- **HTTP Method**: `GET`
- **Endpoint**: `/products`
- **Auth Requirement**: Public
- **Query Parameters**:
  - `category` (optional, string): Filter by category name or slug (e.g. `Paints`, `brushes`)
  - `brand` (optional, string): Filter by manufacturer brand
  - `q` (optional, string): Keyword search query
  - `min_price` (optional, number)
  - `max_price` (optional, number)
  - `in_stock` (optional, boolean): `true` to filter out depleted items
  - `sort` (optional, string): `price-low`, `price-high`, `rating`, `newest`, `featured`
  - `page` (optional, integer, default: `1`)
  - `page_size` (optional, integer, default: `12`)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "total": 48,
  "page": 1,
  "pageSize": 12,
  "totalPages": 4,
  "products": [
    {
      "id": "AF-PNT-001",
      "name": "Winsor & Newton Artists' Oil Colour Set (10 x 37ml)",
      "category": "Paints",
      "categoryId": "paints",
      "brand": "Winsor & Newton",
      "price": 4850.00,
      "originalPrice": 5400.00,
      "discount": 10,
      "stock": 28,
      "rating": 4.9,
      "reviewsCount": 84,
      "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
      "badge": "Master Series",
      "aiTag": "Pure Cadmium & Cobalt Pigments",
      "description": "Formulated with single high-grade pigments for unsurpassed tinting strength and buttery consistency."
    }
  ]
}
```
- **Frontend Function / File**: `ProductService.getProducts(params)` in `js/services/productService.js` / `ProductsPage.fetchProducts()` in `js/pages/products.js`.

---

### 2.2 Get Product Details & Specifications
- **HTTP Method**: `GET`
- **Endpoint**: `/products/:id` (e.g. `/products/AF-PNT-001`)
- **Auth Requirement**: Public
- **Path Parameters**: `id` (string: Product SKU or ID)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "product": {
    "id": "AF-PNT-001",
    "name": "Winsor & Newton Artists' Oil Colour Set (10 x 37ml)",
    "category": "Paints",
    "categoryId": "paints",
    "brand": "Winsor & Newton",
    "price": 4850.00,
    "originalPrice": 5400.00,
    "discount": 10,
    "stock": 28,
    "rating": 4.9,
    "reviewsCount": 84,
    "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Formulated with single high-grade pigments for unsurpassed tinting strength...",
    "specifications": {
      "Medium Classification": "Artists' Grade Professional Oil Paint",
      "Vehicle Binder": "Refined Alkali Cold-Pressed Linseed Oil",
      "Lightfastness Rating": "ASTM Class I (Excellent Permanence)",
      "Opacity Spectrum": "Semi-Transparent to High Opaque",
      "Country of Origin": "United Kingdom",
      "Atelier Safety": "ASTM D-4236 Certified Non-Toxic"
    },
    "aiCompatibility": [
      "Claessens Belgian Double-Primed Linen Canvas",
      "Raphaël Kolinsky Red Sable Filbert Brushes",
      "Stand Oil & Odorless Mineral Spirits"
    ]
  }
}
```
- **Frontend Function / File**: `ProductService.getProductById(id)` in `js/services/productService.js` / `ProductDetailPage.init()` in `js/pages/product-detail.js`.

---

### 2.3 Get 10 Art Categories
- **HTTP Method**: `GET`
- **Endpoint**: `/categories`
- **Auth Requirement**: Public
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "categories": [
    { "id": "accessories", "name": "Accessories", "count": 24, "icon": "palette" },
    { "id": "brushes", "name": "Brushes", "count": 42, "icon": "brush" },
    { "id": "calligraphy", "name": "Calligraphy", "count": 18, "icon": "feather" },
    { "id": "canvas", "name": "Canvas", "count": 35, "icon": "square" },
    { "id": "drawing-media", "name": "Drawing Media", "count": 29, "icon": "edit-2" },
    { "id": "easels", "name": "Easels", "count": 14, "icon": "triangle" },
    { "id": "painting-medium", "name": "Painting Medium", "count": 22, "icon": "droplet" },
    { "id": "paints", "name": "Paints", "count": 68, "icon": "disc" },
    { "id": "paper-pads", "name": "Paper & Pads", "count": 51, "icon": "book-open" },
    { "id": "pen-markers", "name": "Pen & Markers", "count": 39, "icon": "pen-tool" }
  ]
}
```
- **Frontend Function / File**: `ProductService.getCategories()` in `js/services/productService.js` / `HeaderComponent.render()` in `js/components/header.js`.

---

## 3. Search & Instant Autocomplete Endpoints

### 3.1 Live Catalog Search
- **HTTP Method**: `GET`
- **Endpoint**: `/search`
- **Auth Requirement**: Public
- **Query Parameters**:
  - `q` (required, string): Query string
  - `category` (optional, string)
  - `page` (optional, integer)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "query": "sable",
  "provider": "standard-keyword",
  "resultCount": 3,
  "products": [
    {
      "id": "AF-BRS-002",
      "name": "Raphaël Kolinsky Red Sable Filbert Brush Set (3-Piece)",
      "category": "Brushes",
      "brand": "Raphaël Paris",
      "price": 3250.00,
      "stock": 14,
      "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80"
    }
  ]
}
```
- **Frontend Function / File**: `SearchModule.executeSearch()` in `js/search.js`.

---

### 3.2 Autocomplete Suggestions
- **HTTP Method**: `GET`
- **Endpoint**: `/search/suggestions`
- **Auth Requirement**: Public
- **Query Parameters**: `q` (required, string)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "query": "oil",
  "categories": [
    { "id": "paints", "name": "Paints" },
    { "id": "painting-medium", "name": "Painting Medium" }
  ],
  "products": [
    {
      "id": "AF-PNT-001",
      "name": "Winsor & Newton Artists' Oil Colour Set",
      "category": "Paints",
      "price": 4850.00,
      "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80"
    }
  ]
}
```
- **Frontend Function / File**: `SearchModule.getSuggestions()` in `js/search.js`.

---

## 4. Shopping Cart Endpoints

### 4.1 Get Active Database Cart
- **HTTP Method**: `GET`
- **Endpoint**: `/cart`
- **Auth Requirement**: Public / Session / Bearer Token
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "items": [
    {
      "cartItemId": "AF-PNT-001",
      "productId": "AF-PNT-001",
      "name": "Winsor & Newton Artists' Oil Colour Set (10 x 37ml)",
      "brand": "Winsor & Newton",
      "category": "Paints",
      "price": 4850.00,
      "originalPrice": 5400.00,
      "quantity": 1,
      "stock": 28,
      "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80"
    }
  ],
  "summary": {
    "itemCount": 1,
    "subtotal": 4850.00,
    "discount": 0.00,
    "shipping": 0.00,
    "tax": 582.00,
    "total": 5432.00,
    "freeShippingThreshold": 1499.00,
    "remainingForFreeShipping": 0.00
  }
}
```
- **Frontend Function / File**: `CartService.getCart()` in `js/services/cartService.js`.

---

### 4.2 Add Product to Cart
- **HTTP Method**: `POST`
- **Endpoint**: `/cart/add`
- **Auth Requirement**: Public / Session / Bearer Token
- **Request Body**:
```json
{
  "productId": "AF-PNT-001",
  "quantity": 1
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": { "items": [], "summary": {} }
}
```
- **Frontend Function / File**: `CartService.addToCart(productId, quantity)` in `js/services/cartService.js`.

---

### 4.3 Update Cart Item Quantity
- **HTTP Method**: `PUT`
- **Endpoint**: `/cart/items/:id` (e.g. `/cart/items/AF-PNT-001`)
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Cart item quantity updated",
  "cart": { "items": [], "summary": {} }
}
```
- **Frontend Function / File**: `CartService.updateQuantity(cartItemId, quantity)` in `js/services/cartService.js`.

---

### 4.4 Remove Item from Cart
- **HTTP Method**: `DELETE`
- **Endpoint**: `/cart/items/:id` (e.g. `/cart/items/AF-PNT-001`)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Cart item removed",
  "cart": { "items": [], "summary": {} }
}
```
- **Frontend Function / File**: `CartService.removeItem(cartItemId)` in `js/services/cartService.js`.

---

## 5. Saved Studio Wishlist Endpoints

### 5.1 Get Authenticated Customer Wishlist
- **HTTP Method**: `GET`
- **Endpoint**: `/wishlist`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "items": [
    {
      "id": "AF-DRW-005",
      "name": "Caran d'Ache Luminance 6901 Colored Pencil Wooden Box Set",
      "category": "Drawing Media",
      "brand": "Caran d'Ache",
      "price": 14200.00,
      "originalPrice": 15800.00,
      "stock": 8,
      "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
      "addedDate": "2026-08-28T10:00:00Z"
    }
  ]
}
```
- **Frontend Function / File**: `WishlistService.getWishlist()` in `js/services/wishlistService.js`.

---

### 5.2 Add Product to Wishlist
- **HTTP Method**: `POST`
- **Endpoint**: `/wishlist/add`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Request Body**:
```json
{
  "productId": "AF-DRW-005"
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Added to your studio wishlist.",
  "count": 2
}
```
- **Frontend Function / File**: `WishlistService.addToWishlist(productId)` in `js/services/wishlistService.js`.

---

### 5.3 Remove Product from Wishlist
- **HTTP Method**: `DELETE`
- **Endpoint**: `/wishlist/items/:id` (e.g. `/wishlist/items/AF-DRW-005`)
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Removed from wishlist.",
  "count": 1
}
```
- **Frontend Function / File**: `WishlistService.removeFromWishlist(productId)` in `js/services/wishlistService.js`.

---

## 6. Checkout & Order Verification Endpoints

### 6.1 Authoritative Order Checkout & Creation
- **HTTP Method**: `POST`
- **Endpoint**: `/orders/checkout`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Request Body**:
```json
{
  "customer": {
    "firstName": "Aarav",
    "lastName": "Sharma",
    "email": "artist.patron@studio.com",
    "phone": "+91 98765 43210"
  },
  "shippingAddress": {
    "address": "Flat 402, Lotus Fine Arts Studio, MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "notes": "Fragile mineral pigments"
  },
  "paymentMethod": "upi",
  "items": [
    {
      "id": "AF-PNT-001",
      "name": "Winsor & Newton Artists' Oil Colour Set (10 x 37ml)",
      "price": 4850.00,
      "quantity": 1
    }
  ],
  "clientSubtotal": 4850.00,
  "clientTotal": 5432.00
}
```
- **Expected Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order verified, created, and inventory deducted.",
  "orderId": "AF-ORD-882194",
  "total": 5432.00,
  "status": "Confirmed",
  "orderDate": "2026-09-04T00:50:00Z"
}
```
- **Error Response (422 Unprocessable Entity)**:
```json
{
  "success": false,
  "message": "Price verification failed: AF-PNT-001 authoritative price is ₹4,850.00."
}
```
- **Frontend Function / File**: `CheckoutPage._bindEvents()` in `js/pages/checkout.js`.

---

## 7. Customer Orders & Profile Endpoints

### 7.1 Get Customer Order History
- **HTTP Method**: `GET`
- **Endpoint**: `/orders`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "orders": [
    {
      "orderId": "AF-ORD-882194",
      "orderDate": "2026-09-04T00:50:00Z",
      "status": "Confirmed",
      "paymentStatus": "Paid",
      "paymentMethod": "UPI / QR",
      "total": 5432.00,
      "subtotal": 4850.00,
      "shippingFee": 0.00,
      "taxAmount": 582.00,
      "items": [
        {
          "id": "AF-PNT-001",
          "name": "Winsor & Newton Artists' Oil Colour Set (10 x 37ml)",
          "price": 4850.00,
          "quantity": 1,
          "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80"
        }
      ],
      "shippingAddress": {
        "address": "Flat 402, Lotus Fine Arts Studio, MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      }
    }
  ]
}
```
- **Frontend Function / File**: `OrdersPage.fetchOrders()` in `js/pages/orders.js`.

---

### 7.2 Get / Update Patron Profile
- **HTTP Methods**: `GET` / `PUT`
- **Endpoint**: `/auth/profile`
- **Auth Requirement**: Authenticated (`Bearer <token>`)
- **PUT Request Body**:
```json
{
  "name": "Aarav Sharma",
  "phone": "+91 98765 43210",
  "discipline": "Oil Painting & Mineral Glazes",
  "address": "Flat 402, Lotus Fine Arts Studio, MG Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001"
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": {
    "id": "CUST-104",
    "name": "Aarav Sharma",
    "email": "artist.patron@studio.com",
    "phone": "+91 98765 43210",
    "discipline": "Oil Painting & Mineral Glazes",
    "address": "Flat 402, Lotus Fine Arts Studio, MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  }
}
```
- **Frontend Function / File**: `ProfilePage.loadProfile()` / `ProfilePage._bindEvents()` in `js/pages/profile.js`.

---

## 8. AI Recommendations Endpoints

### 8.1 User Personalized Recommendations
- **HTTP Method**: `GET`
- **Endpoint**: `/recommendations/user`
- **Auth Requirement**: Optional / Authenticated
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "isPersonalized": true,
  "headline": "Recommended For Your Atelier",
  "supportingText": "Curated for your preferences in Oil Painting and archival canvas preparation.",
  "products": [
    {
      "id": "AF-CNV-003",
      "name": "Claessens Belgian Double Oil-Primed Linen Canvas Roll (2.1m x 10m)",
      "category": "Canvas",
      "brand": "Claessens Belgium",
      "price": 18500.00,
      "originalPrice": 19800.00,
      "discount": 7,
      "stock": 6,
      "rating": 5.0,
      "reviewsCount": 46,
      "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
      "badge": "Belgian Linen",
      "aiTag": "AI Matched Surface for Oil"
    }
  ]
}
```
- **Frontend Function / File**: `RecommendationModule.getRecommendations()` in `js/recommendations.js`.

---

## 9. Admin Portal Endpoints

### 9.1 Executive Dashboard Statistics
- **HTTP Method**: `GET`
- **Endpoint**: `/admin/stats`
- **Auth Requirement**: Admin Role Authenticated
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 487290.00,
    "totalOrders": 142,
    "totalCustomers": 89,
    "totalProducts": 48,
    "lowStockCount": 3,
    "lowStockProducts": [
      {
        "id": "AF-EAS-006",
        "name": "Mabef M-04 Studio Heavy-Duty Beechwood Easel",
        "category": "Easels",
        "stock": 0,
        "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80"
      }
    ],
    "recentOrders": [
      {
        "orderId": "AF-ORD-882194",
        "customer": { "firstName": "Aarav", "lastName": "Sharma", "email": "artist.patron@studio.com" },
        "orderDate": "2026-09-04T00:50:00Z",
        "total": 5432.00,
        "status": "Confirmed",
        "items": [{ "name": "Winsor & Newton Artists' Oil Colour Set" }]
      }
    ]
  }
}
```
- **Frontend Function / File**: `loadDashboardData()` in `admin/dashboard.html`.

---

### 9.2 Admin Products CRUD & Image Upload
- **HTTP Methods & Paths**:
  - `GET /admin/products`: List all products
  - `POST /admin/products`: Create a new product
  - `PUT /admin/products/:id`: Update existing product
  - `DELETE /admin/products/:id`: Delete product
  - `POST /admin/upload-image`: Image upload handler
- **POST `/admin/products` Request Body**:
```json
{
  "name": "Schmincke Horadam Aquarell Artists' Watercolors (24-Pan Set)",
  "category": "Paints",
  "brand": "Schmincke Germany",
  "price": 8900.00,
  "discount": 5,
  "stock": 16,
  "aiTag": "AI Kodorite Binder Formulation",
  "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
  "description": "Finest artists' watercolours containing highest quality single pigments."
}
```
- **Expected Success Response (201 Created / 200 OK)**:
```json
{
  "success": true,
  "message": "Product saved successfully",
  "product": { "id": "AF-PNT-049", "name": "Schmincke Horadam Aquarell Artists' Watercolors" }
}
```
- **Frontend Function / File**: `fetchProducts()`, `openModal()`, `deleteProduct()` in `admin/products.html`.

---

### 9.3 Admin Inventory Stock Level Updates
- **HTTP Method**: `PUT`
- **Endpoint**: `/admin/inventory/:id` (e.g. `/admin/inventory/AF-PNT-001`)
- **Request Body**:
```json
{
  "stock": 45
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Inventory stock level updated in MySQL database.",
  "id": "AF-PNT-001",
  "stock": 45,
  "status": "In Stock"
}
```
- **Frontend Function / File**: `updateStock(id)` in `admin/inventory.html`.

---

### 9.4 Admin Order Fulfillment Status Updates
- **HTTP Method**: `PUT`
- **Endpoint**: `/admin/orders/:id/status` (e.g. `/admin/orders/AF-ORD-882194/status`)
- **Request Body**:
```json
{
  "status": "Shipped"
}
```
- **Expected Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order fulfillment status updated.",
  "orderId": "AF-ORD-882194",
  "status": "Shipped"
}
```
- **Frontend Function / File**: `btn-save-order-status` handler in `admin/orders.html`.

---

### 9.5 Admin Customer Directory & Analytics
- **HTTP Methods & Paths**:
  - `GET /admin/customers`: Returns sanitized patron directory
  - `GET /admin/analytics`: Returns revenue trends, category share, and medium preferences
- **Expected Success Response for `GET /admin/analytics` (200 OK)**:
```json
{
  "success": true,
  "analytics": {
    "salesTrends": [
      { "month": "May 2026", "revenue": 84200.00, "orders": 26 },
      { "month": "Jun 2026", "revenue": 105400.00, "orders": 34 },
      { "month": "Jul 2026", "revenue": 138600.00, "orders": 41 },
      { "month": "Aug 2026", "revenue": 159090.00, "orders": 41 }
    ],
    "customerPreferences": [
      { "discipline": "Oil Painting & Glazes", "percentage": 38 },
      { "discipline": "Watercolors & Gouache", "percentage": 27 },
      { "discipline": "Drawing & Pastels", "percentage": 18 },
      { "discipline": "Calligraphy & Ink", "percentage": 11 },
      { "discipline": "Acrylic & Mixed Media", "percentage": 6 }
    ],
    "popularProducts": [
      { "id": "AF-PNT-001", "name": "Winsor & Newton Artists' Oil Colour Set", "category": "Paints", "salesVolume": 38, "revenue": 184300.00, "image": "..." }
    ],
    "categoryPerformance": [
      { "category": "Paints", "score": 96, "productCount": 68 },
      { "category": "Canvas", "score": 88, "productCount": 35 }
    ]
  }
}
```
- **Frontend Function / File**: `loadAnalytics()` in `admin/analytics.html`.
