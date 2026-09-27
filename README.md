# SmartShop AI

A simple AI-powered shopping chatbot for finding and recommending products.

## Features
- AI shopping chatbot
- Product search
- Product recommendations
- Product comparison
- Product cards

## Technology
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- AI: Gemini API or OpenAI API

## Basic Flow
User → React Chat UI → Express Backend → AI + MongoDB → Recommendations → User

## Project Goal
Build a simple working shopping assistant first. Use dummy products in MongoDB. Add advanced features later.

## Run the local demo

Requirements: Node.js 20.19+ or 22.12+ and npm.

```powershell
npm install
npm install --prefix frontend
npm install --prefix backend
npm run dev
```

Open the Vite URL printed in the terminal (normally http://localhost:5173). The API runs at http://localhost:5000 and is proxied by Vite. This runnable version uses ten in-memory sample products, so MongoDB and an AI API key are not required. The shopping assistant is deterministic and only recommends products from that catalog.

Use `npm run build` to build the frontend or `npm start` to run just the API. The API includes product listing/search, product detail, comparison, chat recommendations, and a health check.

## Deploy to Vercel

Import `sahilsirsam007/AI-Smart-Shop` in Vercel. The project is configured to build the Vite frontend into `public/` and run the Express API as a Vercel server. No environment variables are required for the sample-data version.
