require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5177;
const TOKEN = process.env.THENEWSAPI_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Validate token at startup
if (!TOKEN) {
  console.warn(
    "⚠️  THENEWSAPI_TOKEN not set in .env. The /api/news/all endpoint will fail.",
  );
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy endpoint for news
app.get("/api/news/all", async (req, res) => {
  try {
    if (!TOKEN) {
      return res.status(500).json({
        error: "Server configuration error",
        message: "THENEWSAPI_TOKEN not configured",
      });
    }

    // Extract query parameters
    const { page = "1", categories, search, limit = "3" } = req.query;

    // Build API URL
    let apiUrl = `https://api.thenewsapi.com/v1/news/all?language=en&limit=${limit}&page=${page}&api_token=${TOKEN}`;

    // Add categories OR search (mutually exclusive)
    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`;
      // Log without token
      console.log(
        `[${new Date().toISOString()}] GET /api/news/all - search="${search}", page=${page}`,
      );
    } else if (categories) {
      apiUrl += `&categories=${encodeURIComponent(categories)}`;
      // Log without token
      console.log(
        `[${new Date().toISOString()}] GET /api/news/all - categories="${categories}", page=${page}`,
      );
    } else {
      // Default to tech
      apiUrl += `&categories=tech`;
      console.log(
        `[${new Date().toISOString()}] GET /api/news/all - categories="tech" (default), page=${page}`,
      );
    }

    // Make request to TheNewsApi
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Handle errors
    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Daily request limit reached. Please try again tomorrow.",
        });
      }
      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({
          error: "Authentication failed",
          message: "TheNewsApi authentication failed. Check your token.",
        });
      }
      return res.status(response.status).json({
        error: "API error",
        message: data.message || "An error occurred",
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n📰 News API Proxy running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
});
