// server/README.md

# News App - Backend Server

Express.js proxy server that securely communicates with TheNewsApi on behalf of the frontend.

## Features

- ✅ Secure API token handling (never exposed to browser)
- ✅ CORS support for frontend development
- ✅ Error handling (rate limits, auth failures)
- ✅ Request logging without tokens
- ✅ Health check endpoint

## Setup

1. **Get an API token**: Visit [TheNewsApi](https://www.thenewsapi.com/) and sign up for free
2. **Create `.env`**: Copy `.env.example` to `.env` and add your token
   ```bash
   cp .env.example .env
   # Edit .env and add THENEWSAPI_TOKEN
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the server**:
   ```bash
   npm run dev
   ```

The server runs on `http://localhost:5177` by default.

## Endpoints

### `GET /api/health`

Health check endpoint. Returns `{ status: "ok", timestamp: "..." }`

### `GET /api/news/all`

Proxy for TheNewsApi /v1/news/all endpoint.

**Query Parameters:**

- `page` (default: 1) - Page number for pagination
- `categories` - News category (e.g., `tech`, `general`, `science`)
- `search` - Search query (mutually exclusive with categories)
- `limit` (default: 3) - Number of results per page

**Examples:**

- `/api/news/all?categories=tech&page=1`
- `/api/news/all?search=bitcoin&page=1`

**Responses:**

- `200` - Success, returns news articles
- `429` - Daily request limit exceeded
- `401/403` - Authentication failed
- `500` - Server error

## Environment Variables

- `THENEWSAPI_TOKEN` (required) - Your TheNewsApi token
- `PORT` (optional) - Server port, defaults to 5177

## Notes

- Never commit `.env` with real tokens
- The server logs all requests **without** including the API token
- Frontend connects via `http://localhost:5177/api/*`
