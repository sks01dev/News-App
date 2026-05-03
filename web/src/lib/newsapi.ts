export interface Article {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  relevance_score: number | null;
}

export interface NewsResponse {
  data: Article[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}

interface CacheEntry {
  data: NewsResponse;
  timestamp: number;
}

class NewsApiClient {
  private baseUrl = "/api/news";
  private cache: Map<string, CacheEntry> = new Map();
  private prefetchQueue: Map<string, Promise<NewsResponse>> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(query: {
    page: number;
    categories?: string;
    search?: string;
  }): string {
    const { page, categories, search } = query;
    return `page:${page}|cat:${categories || "none"}|search:${search || "none"}`;
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheTimeout;
  }

  async fetchNews(query: {
    page: number;
    categories?: string;
    search?: string;
  }): Promise<NewsResponse> {
    const cacheKey = this.getCacheKey(query);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached.data;
    }

    // Build query string
    const params = new URLSearchParams();
    params.append("page", String(query.page));
    params.append("limit", "3");

    if (query.search) {
      params.append("search", query.search);
      console.log(
        `[API] Fetching search: "${query.search}", page ${query.page}`,
      );
    } else {
      const category = query.categories || "tech";
      params.append("categories", category);
      console.log(`[API] Fetching category: "${category}", page ${query.page}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}/all?${params}`);

      if (!response.ok) {
        const error = await response.json();
        const statusMessage = response.status === 429 ? "429 " : "";
        throw new Error(
          `${statusMessage}${error.message || `HTTP ${response.status}`}`,
        );
      }

      const data: NewsResponse = await response.json();

      // Store in cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[API Error] ${message}`);
      throw err;
    }
  }

  prefetch(query: {
    page: number;
    categories?: string;
    search?: string;
  }): void {
    const cacheKey = this.getCacheKey(query);

    // Don't prefetch if already cached or already prefetching
    if (this.cache.has(cacheKey) || this.prefetchQueue.has(cacheKey)) {
      return;
    }

    console.log(`[Prefetch] ${cacheKey}`);
    const promise = this.fetchNews(query);
    this.prefetchQueue.set(cacheKey, promise);

    promise
      .then(() => {
        this.prefetchQueue.delete(cacheKey);
      })
      .catch(() => {
        this.prefetchQueue.delete(cacheKey);
      });
  }

  clearCache(): void {
    this.cache.clear();
    console.log("[Cache] Cleared");
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const newsApi = new NewsApiClient();
