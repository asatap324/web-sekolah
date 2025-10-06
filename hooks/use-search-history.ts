// hooks/use-search-history.ts
import { useState, useEffect } from "react";

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem("search-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setHistory((prev) => {
      const updated = [query, ...prev.filter((h) => h !== query)].slice(0, 5);

      // Save to localStorage
      try {
        localStorage.setItem("search-history", JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save search history:", error);
      }

      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("search-history");
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
