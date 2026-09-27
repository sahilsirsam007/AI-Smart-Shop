# User Flow

## Example

```text
User:
"I need wireless headphones under 3000"

        ↓

React Chatbot

        ↓

POST /api/chat

        ↓

AI understands:
Category = Headphones
Budget = ₹3000
Type = Wireless

        ↓

MongoDB Search

        ↓

Matching Products

        ↓

AI Recommendation

        ↓

Product Cards

        ↓

User
```

## Second Example

```text
User:
"Compare product A and product B"

        ↓

Backend gets both products

        ↓

AI creates comparison

        ↓

Frontend displays comparison table
```
