import React, { useState, useEffect } from "react";
import { Article, NewsResponse, newsApi } from "./lib/newsapi";
import { HeadlinesList } from "./components/HeadlinesList";

const CATEGORIES = [
  "tech",
  "general",
  "science",
  "sports",
  "business",
  "health",
  "entertainment",
  "politics",
  "food",
  "travel",
];

export default function App() {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState("tech");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimitError, setIsRateLimitError] = useState(false);
  const [fullScreenMessage, setFullScreenMessage] = useState<string | null>(
    null,
  );
  const [categoryLimitMessage, setCategoryLimitMessage] = useState<
    string | null
  >(null);
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const favoriteIds = new Set(favorites.map((item) => item.uuid));

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    }
  }, []);

  // Persist favorites whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (article: Article) => {
    setFavorites((prev) => {
      const alreadySaved = prev.some((item) => item.uuid === article.uuid);
      if (alreadySaved) {
        return prev.filter((item) => item.uuid !== article.uuid);
      }
      return [article, ...prev];
    });
  };

  // Fetch articles when category or search changes
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);
      setIsRateLimitError(false);
      setCategoryLimitMessage(null);
      setFullScreenMessage(null);

      try {
        const response = await newsApi.fetchNews({
          page: 1,
          categories: search ? undefined : categories,
          search: search || undefined,
        });

        setArticles(response.data || []);
        setTotalFound(response.meta?.found || 0);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch news";
        setArticles([]);

        const isRateLimit =
          message.includes("429") || message.includes("Daily request limit");
        const isAuthError = message.includes("401") || message.includes("403");

        if (isRateLimit) {
          setFullScreenMessage(
            "Daily API limit reached. Please try again tomorrow or later.",
          );
          setIsRateLimitError(true);
          setError(null);
        } else if (isAuthError) {
          setError(
            "🔐 TheNewsApi authentication failed. Check your API token configuration.",
          );
          setIsRateLimitError(false);
          setFullScreenMessage(null);
        } else {
          setError(message);
          setIsRateLimitError(false);
          setFullScreenMessage(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [categories, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    newsApi.clearCache();
    setSearch(searchInput);
    setPage(1);
    setShowFavorites(false);
    setShowMobileFilters(false);
    setError(null);
    setCategoryLimitMessage(null);
    setFullScreenMessage(null);
  };

  const handleCategoryChange = (cat: string) => {
    if (cat === categories && search === "") return;
    newsApi.clearCache();
    setCategories(cat);
    setSearch("");
    setSearchInput("");
    setPage(1);
    setShowFavorites(false);
    setShowMobileFilters(false);
    setError(null);
    setCategoryLimitMessage(null);
    setFullScreenMessage(null);
  };

  const handleClearSearch = () => {
    newsApi.clearCache();
    setSearch("");
    setSearchInput("");
    setCategories("tech");
    setPage(1);
    setShowFavorites(false);
    setError(null);
    setCategoryLimitMessage(null);
    setFullScreenMessage(null);
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setShowMobileFilters(false);
  };

  const handleExitFavorites = () => {
    setShowFavorites(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    const maxVisible = Math.min(3, articles.length || 3);
    if (newPage < 1 || newPage > maxVisible) {
      setCategoryLimitMessage(
        "Only the first 3 articles are available for this topic today. Try another topic or return later.",
      );
      setError(null);
      setIsRateLimitError(false);
      return;
    }

    setError(null);
    setIsRateLimitError(false);
    setCategoryLimitMessage(null);
    setFullScreenMessage(null);
    setPage(newPage);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">📰 News</h1>
      </header>

      <div className="container">
        {/* Sidebar */}
        <aside
          className={`sidebar ${showMobileFilters ? "mobile-open" : ""}`}
          role="complementary"
          aria-label="Filters and navigation"
        >
          {/* Search */}
          <form onSubmit={handleSearch} className="search-form" role="search">
            <input
              type="text"
              placeholder="Search news..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
              aria-label="Search articles"
            />
            <button type="submit" className="btn-search">
              Search
            </button>
          </form>

          {search && (
            <button
              onClick={handleClearSearch}
              className="btn-clear-search"
              aria-label="Clear search"
            >
              Clear search
            </button>
          )}

          {/* Categories */}
          <div className="categories">
            <h2>Categories</h2>
            <div className="category-list" role="list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-btn ${categories === cat && !search ? "active" : ""}`}
                  aria-pressed={categories === cat && !search}
                  role="listitem"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Button */}
          <button
            onClick={handleShowFavorites}
            className={`btn-favorites ${showFavorites ? "active" : ""}`}
            aria-pressed={showFavorites}
            aria-label={`${showFavorites ? "Hide" : "Show"} favorites (${favorites.length} saved)`}
          >
            ❤️ Favorites ({favorites.length})
          </button>

          {/* Mobile close button */}
          <button
            className="btn-close-mobile"
            onClick={() => setShowMobileFilters(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </aside>

        {/* Mobile filter toggle */}
        <button
          className="btn-toggle-filters"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          aria-label={showMobileFilters ? "Hide filters" : "Show filters"}
          aria-expanded={showMobileFilters}
        >
          {showMobileFilters ? "✕ Hide Filters" : "☰ Show Filters"}
        </button>

        {/* Main Content */}
        <main className="main-content" role="main">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="hero-tag">Fast, secure news for every screen.</p>
              <h2>
                {search
                  ? `Search results for “${search}”`
                  : `Top stories in ${categories}`}
              </h2>
              <p>
                Explore curated news with smart browsing, fast results, and a
                dedicated favorites panel for the stories you want to keep.
              </p>
            </div>

            <div className="hero-actions">
              <span className="hero-pill">
                {search ? "Search mode" : `${categories} category`}
              </span>
              <span className="hero-pill">{totalFound} articles found</span>
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn-clear-search hero-reset"
                >
                  Reset search
                </button>
              )}
            </div>
          </section>

          {fullScreenMessage ? (
            <div className="full-screen-message">
              <div className="message-card">
                <h2>Daily limit reached</h2>
                <p>{fullScreenMessage}</p>
              </div>
            </div>
          ) : showFavorites ? (
            <div className="favorites-view">
              <div className="favorites-header">
                <h2>Saved Favorites</h2>
                <button onClick={handleExitFavorites} className="btn-back">
                  ← Back to News
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📌</div>
                  <h3>No favorites yet</h3>
                  <p>Save articles to view them here</p>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.map((article) => (
                    <article key={article.uuid} className="favorite-card">
                      {article.image_url && (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="favorite-image"
                        />
                      )}
                      <div className="favorite-content">
                        <h3>{article.title}</h3>
                        <p className="favorite-source">{article.source}</p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-read"
                        >
                          Read
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {categoryLimitMessage && (
                <div className="warning-banner" role="status">
                  <span>{categoryLimitMessage}</span>
                </div>
              )}

              {error && (
                <div
                  className={`error-banner ${isRateLimitError ? "rate-limit" : ""}`}
                  role="alert"
                >
                  <span>{error}</span>
                </div>
              )}

              <HeadlinesList
                page={page}
                categories={categories}
                search={search}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                articles={articles}
                totalFound={totalFound}
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />

              <div className="cache-info">
                {!isLoading && articles.length > 0 && (
                  <small>
                    Viewing article {Math.min(page, articles.length)} of{" "}
                    {articles.length}
                  </small>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>Powered by TheNewsApi • © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
