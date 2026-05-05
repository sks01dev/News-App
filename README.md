# News App

A polished news aggregator built with React, TypeScript, Vite, and Express. This application delivers fast headlines, searchable categories, favorites, offline caching, and a mobile-friendly reading experience.

## Key Features

- **Live news feed** using TheNewsApi
- **Search and category browsing** for tech, business, sports, health, science, and entertainment
- **Favorites management** for saved stories
- **Responsive design** optimized for desktop and mobile
- **Offline-ready** caching with a service worker
- **Secure API proxy** to keep the news token off the client
- **Accessible UI** with ARIA labels and keyboard-friendly controls

## Tech Stack

- Frontend: `React 18`, `TypeScript`, `Vite`
- Backend: `Node.js`, `Express`, `dotenv`, `helmet`, `cors`
- Styling: modern responsive CSS
- API: `TheNewsApi`
- Dev tooling: `concurrently`

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- TheNewsApi account and API key

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/news-app.git
   cd News-App
   ```

2. Copy the server environment sample:

   ```bash
   cp server/.env.example server/.env
   ```

3. Add your API token in `server/.env`:

   ```env
   THENEWSAPI_TOKEN=your_token_here
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open the frontend in your browser:

   ```text
   http://localhost:5176
   ```

## Available Scripts

From the repository root:

- `npm run dev` - Install dependencies and start both frontend and backend
- `npm run web:install` - Install frontend dependencies only
- `npm run server:install` - Install backend dependencies only
- `npm run web:dev` - Start the Vite frontend only
- `npm run server:dev` - Start the Express backend only
- `npm run build` - Build the frontend for production

## Project Structure

```
News-App/
├── package.json            # Root scripts and dev dependencies
├── package-lock.json       # Lockfile
├── .gitignore
├── server/                 # Express backend proxy
│   ├── package.json
│   ├── server.js
│   └── .env.example
└── web/                    # React frontend
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    ├── public/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles.css
        ├── lib/
        │   └── newsapi.ts
        └── components/
            └── HeadlinesList.tsx
```

## API Configuration

The frontend requests news through the backend proxy so your API token is not exposed in the browser. Configure your token in `server/.env`:

```env
THENEWSAPI_TOKEN=your_token_here
```

## Production Build

Build the frontend assets with:

```bash
npm run build
```

The generated production assets are written to `web/dist/`.

## Deployment Notes

- Deploy the backend separately and update the frontend proxy if needed.
- For frontend-only hosting, build the app and serve `web/dist/`.
- Keep the `.env` file private and never commit your API token.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

MIT License

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
