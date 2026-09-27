# Project Plan

## Phase 1 — Setup
1. Create React frontend.
2. Create Node.js + Express backend.
3. Connect MongoDB.
4. Create `.env` file.

## Phase 2 — Products
Create a Product model with:
- name
- category
- brand
- price
- rating
- features
- description
- image

Add 30–50 sample products.

## Phase 3 — Chatbot
Create a chat API:
`POST /api/chat`

The user sends a message such as:
> I need a laptop under 60000 for coding.

The backend sends the message to the AI and extracts shopping requirements.

## Phase 4 — Search
Use the extracted requirements to search MongoDB.

Example:
- category = Laptop
- maximum price = 60000
- purpose = Coding

## Phase 5 — Recommendation
Rank matching products using price, rating, and feature relevance.

## Phase 6 — Frontend
Create:
- Chat window
- Message bubbles
- Product cards
- Compare button
- Loading indicator

## Phase 7 — Testing
Test:
- budget requests
- category requests
- feature requests
- comparison requests
- no-result requests
