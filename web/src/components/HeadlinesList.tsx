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
  favorites: Set<string>;
  onToggleFavorite: (article: Article) => void;
}

export const HeadlinesList: React.FC<HeadlinesListProps> = ({
  page,
  categories,
  search,
  onPageChange,
  isLoading,
  articles,
  totalFound,
  favorites,
  onToggleFavorite,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalPages = articles.length || 1;

  // Handle transitions when articles change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [articles]);

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

  const currentIndex = Math.min(Math.max(page - 1, 0), articles.length - 1);
  const article = articles[currentIndex] || articles[0];
  const imageUrl = article?.image_url || "/placeholder.svg";
  const isFavorite = favorites.has(article?.uuid || "");

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
              onClick={() => onToggleFavorite(article)}
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
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
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
