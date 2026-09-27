# API Design

## Product APIs

### GET /api/products
Get all products.

### GET /api/products/:id
Get one product.

### GET /api/products/search?q=laptop
Search products.

## Chat API

### POST /api/chat

Request:
```json
{
  "message": "I need a laptop under 60000 for coding"
}
```

Response:
```json
{
  "reply": "Here are some good laptops for coding.",
  "products": []
}
```

## Compare API

### POST /api/products/compare

Request:
```json
{
  "productIds": ["id1", "id2"]
}
```
