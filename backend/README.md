# Backend

A simple Express.js API server for the fullstack lab.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## Available Endpoints

- `GET /health` - Health check endpoint
- `GET /api/hello` - Example GET endpoint
- `POST /api/data` - Example POST endpoint

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
