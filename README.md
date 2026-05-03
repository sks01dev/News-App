// README.md

# 📰 News App

A modern, performant news application built with React + Vite (frontend) and Node.js/Express (backend).

## Features

✨ **Modern UI**

- Flipboard-like single-article view with beautiful dark theme
- Responsive design (desktop sidebar + mobile toggle)
- Smooth animations and transitions
- Accessibility-first approach (semantic HTML, ARIA labels, alt text)

🔍 **Smart Filtering**

- 10 news categories (tech, general, science, sports, business, health, entertainment, politics, food, travel)
- Full-text search capability
- Default category: tech
- Clear visual feedback for active filters

📄 **Intelligent Pagination**

- One article per page (Flipboard-style)
- Circular pager with first/prev/next navigation
- Page numbers displayed (up to 3 visible)
- Prefetching next/prev pages for instant transitions

💾 **Caching & Performance**

- In-memory page caching (5-minute TTL)
- Automatic prefetch when reaching 2nd or last article
- No flashing when swapping cached pages
- Instant back-navigation to cached results

❤️ **Favorites**

- Toggle "Save to Favorites" on articles
- Persistent storage in localStorage
- Dedicated favorites sidebar view
- Seamless return to live news

🔐 **Security**

- Express proxy hides API tokens from browser
- All requests logged without exposing secrets
- `.env` contains tokens, never committed

## Project Structure

```
News-App/
├── package.json              # Root scripts (dev, build)
├── .gitignore               # Git ignore rules
├── server/
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express proxy server
│   ├── .env.example         # Environment template
│   └── README.md            # Backend documentation
└── web/
    ├── package.json         # Frontend dependencies
    ├── vite.config.ts       # Vite configuration with proxy
    ├── tsconfig.json        # TypeScript config
    ├── index.html           # HTML entry point
    ├── src/
    │   ├── main.tsx         # React entry point
    │   ├── App.tsx          # Main app component
    │   ├── styles.css       # Global styles
    │   ├── lib/
    │   │   └── newsapi.ts   # API client with caching
    │   └── components/
    │       └── HeadlinesList.tsx  # Article display component
    └── public/
        └── placeholder.svg  # Fallback image
```

## Quick Start

### Prerequisites

- Node.js 16+ (use `nvm` or `fnm` to manage versions)
- npm or yarn

### Setup

1. **Clone or enter the project**

   ```bash
   cd News-App
   ```

2. **Get a free API token**
   - Visit [TheNewsApi](https://www.thenewsapi.com/)
   - Sign up for a free account
   - Copy your API token

3. **Configure environment**

   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and add your THENEWSAPI_TOKEN
   ```

4. **Install & Run**

   ```bash
   npm run dev
   ```

   This single command will:
   - Install all dependencies (server + web)
   - Start the Express proxy on `http://localhost:5177`
   - Start the Vite dev server on `http://localhost:5176`

5. **Open in browser**
   Navigate to `http://localhost:5176`

## Available Scripts

### Root Level

- `npm run dev` - Install deps and start both servers
- `npm run server:install` - Install server dependencies only
- `npm run web:install` - Install web dependencies only
- `npm run server:dev` - Start proxy server
- `npm run web:dev` - Start Vite dev server
- `npm run build` - Build frontend for production

### Server Commands

```bash
cd server
npm run dev    # Start server
npm start      # Alias for dev
```

### Web Commands

```bash
cd web
npm run dev        # Start dev server with HMR
npm run build      # Build for production
npm run preview    # Preview production build
npm run type-check # Check TypeScript types
```

## API Endpoints

### Frontend → Backend

**Proxy Endpoint**: `/api/news/all`

Query Parameters:

- `page` (number, default: 1)
- `categories` (string, e.g., "tech") - use when search is empty
- `search` (string) - use when searching; mutually exclusive with categories
- `limit` (number, default: 3)

Examples:

```
/api/news/all?page=1&categories=tech&limit=3
/api/news/all?page=1&search=bitcoin&limit=3
```

**Health Check**: `/api/health`

- Returns: `{ status: "ok", timestamp: "..." }`

### Error Handling

- **429**: Daily request limit reached
- **401/403**: Authentication failed (check API token)
- **Other**: Server-side error details included

## Configuration

### Environment Variables

**Server (.env)**

```env
THENEWSAPI_TOKEN=your_api_token_here
PORT=5177  # Optional
```

### Vite Config

- Dev server runs on port `5176`
- Proxy: `/api/*` → `http://localhost:5177`
- TypeScript strict mode enabled
- Production build targets ES2020

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

✅ **Caching**: Pages cached for 5 minutes
✅ **Prefetching**: Next/prev pages fetched automatically
✅ **Code Splitting**: React lazy loading ready
✅ **CSS Modules**: Scoped styles prevent conflicts
✅ **Image Optimization**: Fallback for missing images

## Accessibility

✅ Semantic HTML (header, main, aside, footer, article)
✅ ARIA labels on interactive elements
✅ Alt text on images
✅ Keyboard navigation support
✅ Focus indicators visible
✅ Color contrast 7:1+ (AA compliant)

## Development

### TypeScript

Strict mode enabled. Run type checking:

```bash
cd web && npm run type-check
```

### Debugging

- Client logs proxied URLs (without token)
- Server logs all requests (without token)
- Browser DevTools for frontend debugging

### Secrets Management

- `.env` files are **never** committed
- `.env.example` shows required variables
- Use `.gitignore` to prevent accidental commits

## Deployment

### Build for Production

```bash
npm run build:web
```

Outputs to `web/dist/` - ready for static hosting.

### Environment Setup (Production)

1. Set `THENEWSAPI_TOKEN` in production environment
2. Update backend URL in frontend config if needed
3. Build and deploy frontend
4. Deploy Express server separately

## Common Issues

### "Token not configured"

- ✅ Copy `.env.example` to `.env`
- ✅ Add your actual API token to `.env`
- ✅ Restart server (`npm run server:dev`)

### API returns 429 (rate limited)

- TheNewsApi free tier: ~200 requests/day
- Wait 24 hours or upgrade plan

### Port already in use

- Change port in `.env` or `vite.config.ts`
- Find process: `lsof -i :5177`

### CORS errors

- Proxy should handle it
- Check server is running on `localhost:5177`

## Tech Stack

### Frontend

- React 18 with Hooks
- TypeScript 5
- Vite 5 (dev server + bundler)
- Plain CSS (no dependencies)

### Backend

- Node.js 16+
- Express 4
- CORS support
- Minimal dependencies

### Styling

- Dark theme (#333 base)
- Mobile-first responsive
- CSS Grid & Flexbox
- CSS animations

## Resources

- [TheNewsApi Documentation](https://www.thenewsapi.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

1. Check `.env` configuration
2. Verify API token is valid
3. Check console logs (browser + terminal)
4. Ensure servers are running on correct ports

---

Built with ❤️ as a modern news app showcasing React, Vite, and Express best practices.
