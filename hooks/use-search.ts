// hooks/use-search.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { searchBlogs } from "@/app/actions/search/search-blogs";

export type BlogResult = {
  id: string;
  title: string;
  slug: string;
};

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cache = useRef<Map<string, BlogResult[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cache management dengan useCallback untuk stabil reference
  const getFromCache = useCallback((key: string): BlogResult[] | undefined => {
    return cache.current.get(key);
  }, []);

  const setToCache = useCallback((key: string, value: BlogResult[]) => {
    // Limit cache size to 50 entries
    if (cache.current.size >= 50) {
      const firstKey = cache.current.keys().next().value;
      if (firstKey) {
        cache.current.delete(firstKey);
      }
    }
    cache.current.set(key, value);
  }, []);

  // Reset function dengan useCallback untuk stabil reference
  const reset = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      const searchQuery = query.trim();

      // Reset state untuk empty query
      if (searchQuery.length === 0) {
        setResults([]);
        setError(null);
        return;
      }

      // Minimum 2 characters
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      // Check cache first
      const cachedResults = getFromCache(searchQuery);
      if (cachedResults) {
        setResults(cachedResults);
        setError(null);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const data = await searchBlogs(searchQuery, {
          signal: controller.signal,
        });

        // Only update state if not aborted
        if (!controller.signal.aborted) {
          setResults(data);
          setToCache(searchQuery, data);
          setError(null);
        }
      } catch (err: any) {
        // Only update state if not aborted
        if (!controller.signal.aborted) {
          if (err.name === "AbortError") {
            // Request dibatalkan, ignore saja
            return;
          }

          // Handle other errors
          console.error("Search hook error:", err.message);
          setError("Failed to search blogs");
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 500);

    return () => {
      clearTimeout(timeoutId);
      // Don't abort here - let the new request handle cancellation
    };
  }, [query, getFromCache, setToCache]); // Add dependencies

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    reset,
  };
}
