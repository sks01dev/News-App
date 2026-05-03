import React, { useState, useEffect } from "react";
import { Article, NewsResponse, newsApi } from "../lib/newsapi";

interface HeadlinesListProps {
  page: number;
  categories: string;
  search: string;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  articles: Article[];
  totalFound: number;
}

export const HeadlinesList: React.FC<HeadlinesListProps> = ({
  page,
  categories,
  search,
  onPageChange,
  isLoading,
  articles,
  totalFound,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("favorites");
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const limit = 3;
  const totalPages = Math.ceil(totalFound / limit) || 1;

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Handle transitions when articles change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [articles]);

  // Prefetch logic
  useEffect(() => {
    const currentIndex = articles.length > 0 ? 0 : 0;

    // Prefetch next page when viewing 2nd article (index 1)
    if (currentIndex === 1 && page < totalPages) {
      newsApi.prefetch({
        page: page + 1,
        categories: search ? undefined : categories,
        search: search || undefined,
      });
    }

    // Prefetch previous page when at first article and not on page 1
    if (currentIndex === 0 && page > 1) {
      newsApi.prefetch({
        page: page - 1,
        categories: search ? undefined : categories,
        search: search || undefined,
      });
    }
  }, [page, articles.length, totalPages, categories, search]);

  const toggleFavorite = (uuid: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(uuid)) {
        updated.delete(uuid);
      } else {
        updated.add(uuid);
      }
      return updated;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsTransitioning(true);
      setTimeout(() => {
        onPageChange(newPage);
      }, 150);
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="headlines-container">
        <div className="skeleton-card">
          <div className="skeleton skeleton-image"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (!isLoading && articles.length === 0) {
    return (
      <div className="headlines-container">
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <h2>No articles found</h2>
          <p>Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  const article = articles[0];
  const imageUrl = article?.image_url || "/placeholder.svg";
  const isFavorite = favorites.has(article?.uuid);

  return (
    <div className="headlines-container">
      <div
        className={`article-card ${isTransitioning ? "transitioning" : ""}`}
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%), url('${imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img src={imageUrl} alt={article.title} className="article-image" />

        <div className="article-overlay">
          <div className="article-meta">
            <span className="source">{article.source}</span>
            <span className="date">
              {new Date(article.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <p className="article-description">{article.description}</p>

          <div className="article-actions">
            <button
              className={`btn-favorite ${isFavorite ? "active" : ""}`}
              onClick={() => toggleFavorite(article.uuid)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? "❤️" : "🤍"} Save to Favorites
            </button>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-read-more"
            >
              View Full Article →
            </a>
          </div>
        </div>

        <div className="article-pager">
          <button
            className="pager-btn pager-first"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            title="First page"
          >
            «
          </button>

          <button
            className="pager-btn pager-prev"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            title="Previous page"
          >
            ‹
          </button>

          <div className="pager-numbers">
            {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
              const pageNum = page + (i - 1);
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  className={`pager-number ${pageNum === page ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pager-btn pager-next"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            title="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};
