# News App - Complete Project Setup ✅

## Project Structure Created

```
/home/shivam_01/vibe_coding/News-App/
├── package.json                    # Root orchestration with npm scripts
├── README.md                       # Comprehensive documentation
├── .gitignore                      # Excludes .env and build artifacts
│
├── server/                         # Express proxy backend
│   ├── package.json               # Dependencies: express, cors, dotenv
│   ├── server.js                  # Express server (port 5177)
│   ├── .env.example               # Template for API token
│   └── README.md                  # Backend documentation
│
└── web/                           # React + Vite frontend
    ├── package.json               # Dependencies: React, Vite, TypeScript
    ├── vite.config.ts             # Vite config + /api proxy
    ├── tsconfig.json              # TypeScript strict mode
    ├── tsconfig.node.json         # TypeScript for Vite config
    ├── index.html                 # HTML entry point
    ├── src/
    │   ├── main.tsx              # React entry point
    │   ├── App.tsx               # Main app (categories, search, state)
    │   ├── styles.css            # Complete dark theme styling (500+ lines)
    │   ├── lib/
    │   │   └── newsapi.ts        # API client with caching + prefetch
    │   └── components/
    │       └── HeadlinesList.tsx  # Article card + pager component
    └── public/
        └── placeholder.svg        # Fallback image
```

## Files & Components Overview

### Root Files (3 files)

- **package.json**: Defines scripts `dev`, `build`, `server:install`, `web:install`, etc.
- **README.md**: Full setup guide, features, tech stack, deployment info
- **.gitignore**: Excludes .env, node_modules, dist, and build artifacts

### Backend - Express Server (4 files)

- **server/package.json**: express 4.18, cors 2.8, dotenv 16.3
- **server/server.js**:
  - Runs on port 5177
  - Routes: `/api/health`, `/api/news/all`
  - Proxy forwards to TheNewsApi with token protection
  - Error handling (429, 401/403)
  - Logging without token exposure
- **server/.env.example**: Template with THENEWSAPI_TOKEN placeholder
- **server/README.md**: Backend-specific setup and endpoint docs

### Frontend - React + Vite (11 files)

**Config & Entry:**

- **vite.config.ts**: Dev server port 5176, proxy /api/\* to :5177
- **tsconfig.json**: TypeScript strict mode, ES2020 target
- **tsconfig.node.json**: Vite config TypeScript config
- **index.html**: Mounts React to #root

**TypeScript/React Components:**

- **src/main.tsx**: React 18 entry, mounts App to DOM
- **src/App.tsx** (180 lines):
  - State: page, categories (10 total), search, articles, favorites
  - Effects: fetch news on page/category/search change
  - Handlers: search, category change, clear search, favorites toggle
  - Layout: sidebar (desktop) + toggle (mobile), main content area
  - Conditional rendering: live articles or favorites view
  - Mobile breakpoint awareness

- **src/components/HeadlinesList.tsx** (100+ lines):
  - Props: page, categories, search, onPageChange, isLoading, articles, totalFound
  - State: favorites (persisted to localStorage)
  - Prefetch logic: next page at article index 1, prev page at index 0
  - Renders: skeleton loader, article card, empty state
  - Article card: image, gradient overlay, title, description, date, source
  - Actions: favorite toggle, full article link
  - Pager: « › (page buttons) › (circular navigation)

- **src/lib/newsapi.ts** (100+ lines):
  - Types: Article, NewsResponse interfaces
  - Class NewsApiClient:
    - Cache: Map<string, CacheEntry> with 5-minute TTL
    - fetchNews(): Returns cached or fresh data
    - prefetch(): Auto-load next/prev pages
    - clearCache(): Reset when switching filters
    - getCacheStats(): Debug cache state

**Styling:**

- **src/styles.css** (500+ lines):
  - Dark theme: #333 base, #444 panels, #ff6b6b accent
  - Layout: Flexbox header, sidebar, main, footer
  - Components: forms, buttons, cards, pager, favorites grid
  - Animations: skeleton loading, smooth transitions
  - Responsive: 768px breakpoint for mobile layout
  - Accessibility: 7:1 contrast ratios, semantic HTML, ARIA labels

**Assets:**

- **public/placeholder.svg**: SVG fallback for missing images

## Features Implemented ✅

### Article Display

- ✅ Single-article Flipboard-style card view
- ✅ Responsive image with fallback
- ✅ Article metadata (source, date)
- ✅ Title, description, full article link
- ✅ Gradient overlay for text legibility

### Filtering & Search

- ✅ 10 categories: tech, general, science, sports, business, health, entertainment, politics, food, travel
- ✅ Default category: tech
- ✅ Full-text search (mutually exclusive with categories)
- ✅ Clear search button to return to categories
- ✅ Visual feedback (active category highlight)

### Pagination

- ✅ Limit 3 articles per page
- ✅ Circular pager: « (first) › (prev) [page numbers] › (next)
- ✅ Absolute page number buttons (up to 3 visible)
- ✅ Disabled state for boundary pages
- ✅ Total results display

### Performance

- ✅ Page caching (5-minute TTL per page)
- ✅ Automatic prefetch of next page (when at article 2)
- ✅ Automatic prefetch of previous page (when at article 1, page > 1)
- ✅ Instant swap to prefetched pages (no loading spinner flash)
- ✅ Cache cleared on category/search change

### Favorites

- ✅ Toggle "Save to Favorites" button on each article
- ✅ Heart icon (❤️ / 🤍) for visual feedback
- ✅ Persistent storage in localStorage
- ✅ Dedicated sidebar view showing all favorites
- ✅ Favorite count displayed in button
- ✅ "Back to News" link to exit favorites view

### UI/UX

**Desktop (768px+):**

- ✅ Left sidebar: search, categories list (always visible)
- ✅ Favorites button at bottom of sidebar
- ✅ Right content area: large featured article card
- ✅ Card height: responsive, maintains aspect ratio
- ✅ Pager at bottom of card

**Mobile (<768px):**

- ✅ Toggle button: "☰ Show/Hide Filters"
- ✅ Sidebar slides in from left when toggled
- ✅ One-column layout
- ✅ Article card expands to prevent scrolling
- ✅ Touch-friendly button sizes
- ✅ Close button (✕) on sidebar

**Visual Polish:**

- ✅ Dark theme (#333 gradient background)
- ✅ Subtle animations and transitions (0.3s ease)
- ✅ Box shadows on cards and buttons (multiple depth levels)
- ✅ Hover states with transform and color changes
- ✅ Pointer cursor on interactive elements
- ✅ Loading skeleton with shimmer animation
- ✅ Empty state with icon and message

### Accessibility

- ✅ Semantic HTML (header, main, aside, footer, article)
- ✅ ARIA labels on buttons and interactive elements
- ✅ Alt text on images (article image, placeholder)
- ✅ Semantic roles (search form, navigation)
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Color contrast: 7:1+ (AA compliant)
- ✅ Error alerts with role="alert"

### Security

- ✅ API token stored in server/.env (never in browser)
- ✅ Express proxy hides token from frontend
- ✅ Server logs requests without exposing token
- ✅ Client logs proxied URL (without token)
- ✅ .gitignore prevents accidental commit of .env

### Error Handling

- ✅ 429: "Daily request limit reached..."
- ✅ 401/403: "TheNewsApi authentication failed..."
- ✅ Generic errors: Display message, log to console
- ✅ Network errors: Graceful fallback with retry option
- ✅ Empty results: "No articles found" message

### Development

- ✅ TypeScript strict mode enabled
- ✅ Hot Module Replacement (HMR) in Vite
- ✅ Source maps for debugging
- ✅ Request logging (server + client)
- ✅ Cache stats available in console

## How to Run

### Prerequisites

- Node.js 16+
- npm 7+

### Step 1: Get API Token

1. Visit https://www.thenewsapi.com/
2. Sign up for free account
3. Copy your API token

### Step 2: Configure Environment

```bash
cd /home/shivam_01/vibe_coding/News-App
cp server/.env.example server/.env
# Edit server/.env and add: THENEWSAPI_TOKEN=your_token_here
```

### Step 3: Install & Run

**Option A - One Command:**

```bash
npm run dev
```

This installs all dependencies and starts both servers:

- Backend (Express): http://localhost:5177
- Frontend (Vite): http://localhost:5176

**Option B - Manual:**

```bash
npm run server:install
npm run web:install
npm run server:dev  # Terminal 1
npm run web:dev     # Terminal 2
```

### Step 4: Open Browser

Navigate to http://localhost:5176

## API Endpoints

### Frontend Calls Backend

- `GET /api/health` - Health check
- `GET /api/news/all?page=1&categories=tech&limit=3` - Fetch articles

### Backend Calls TheNewsApi

- `GET https://api.thenewsapi.com/v1/news/all?language=en&limit=3&page=X&categories=Y&api_token=TOKEN`

## Environment Variables

### server/.env (Required)

```env
THENEWSAPI_TOKEN=your_free_api_token
PORT=5177  # Optional, defaults to 5177
```

### web/vite.config.ts (Hardcoded)

```typescript
port: 5176
proxy: { '/api': 'http://localhost:5177' }
```

## Tech Stack

| Layer               | Technology | Version         |
| ------------------- | ---------- | --------------- |
| **Frontend**        | React      | 18.2            |
|                     | Vite       | 5.0             |
|                     | TypeScript | 5.3             |
|                     | CSS        | Plain (no deps) |
| **Backend**         | Express    | 4.18            |
|                     | Node.js    | 16+             |
|                     | CORS       | 2.8             |
| **Package Manager** | npm        | 7+              |

## Files Included

- **Total Files**: 20 files
- **TypeScript**: 5 files (.tsx, .ts, .json)
- **JavaScript**: 1 file (server.js)
- **CSS**: 1 file (500+ lines)
- **HTML**: 1 file
- **JSON Config**: 6 files (package.json, tsconfig, vite, etc.)
- **Markdown**: 2 files (README.md)
- **SVG**: 1 file (placeholder)
- **Text**: 1 file (.env.example, .gitignore)

## Code Statistics

- **React Components**: 2 (App.tsx, HeadlinesList.tsx)
- **TypeScript Types**: 3 interfaces (Article, NewsResponse, NewsApiClient)
- **CSS Rules**: 100+ (covering 20+ component types)
- **Lines of Code**:
  - App.tsx: 180 lines
  - HeadlinesList.tsx: 120 lines
  - newsapi.ts: 110 lines
  - styles.css: 520 lines
  - server.js: 90 lines
  - **Total**: ~1,000 lines (excluding node_modules)

## Common Commands

```bash
# Development
npm run dev              # Start both servers
npm run server:dev      # Start backend only
npm run web:dev         # Start frontend only

# Installation
npm run server:install  # Install server deps
npm run web:install     # Install web deps

# Production
npm run build           # Build web for production (web/dist/)

# Type Checking
cd web && npm run type-check
```

## Troubleshooting

| Issue                  | Solution                                                   |
| ---------------------- | ---------------------------------------------------------- |
| "Token not configured" | Add token to `server/.env` and restart                     |
| Port 5177/5176 in use  | Change PORT in .env or vite.config.ts                      |
| Node modules error     | Delete node_modules, run `npm install` in server/ and web/ |
| TypeScript errors      | Run `cd web && npm run type-check`                         |
| API returns 429        | Daily rate limit reached; wait 24 hours                    |
| CORS errors            | Ensure server is running on port 5177                      |

## Next Steps

1. ✅ Project created and ready to run
2. 🚀 Add real API token to server/.env
3. 🚀 Run `npm run dev` to start both servers
4. 🚀 Open http://localhost:5176 in browser
5. 🚀 Explore categories, search, and favorites

Enjoy your modern news app! 📰✨
