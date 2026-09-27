# Setup Guide

## Requirements
Install:
- Node.js
- MongoDB or MongoDB Atlas
- VS Code
- Gemini API key or OpenAI API key

## Create the project

```bash
mkdir smartshop-ai
cd smartshop-ai

npm create vite@latest frontend -- --template react
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv
```

## Frontend

```bash
cd frontend
npm install
npm install axios
npm run dev
```

## Backend

Create `server.js` and start it with:

```bash
node server.js
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_api_key
```

Never upload `.env` to GitHub.
