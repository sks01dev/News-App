import { describe, it, expect, vi } from "vitest";
import { newsApi } from "./lib/newsapi";

// Mock fetch
global.fetch = vi.fn();

describe("NewsApi", () => {
  it("should fetch news successfully", async () => {
    const mockResponse = {
      data: [{ uuid: "1", title: "Test Article" }],
      meta: { found: 1, returned: 1, limit: 3, page: 1 },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await newsApi.fetchNews({ page: 1, categories: "tech" });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe("Test Article");
  });

  it("should handle API errors", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ message: "Rate limit exceeded" }),
    });

    await expect(
      newsApi.fetchNews({ page: 1, categories: "tech" }),
    ).rejects.toThrow("429 Rate limit exceeded");
  });
});
