// components/search-bar.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
  SearchIcon,
  History,
  ArrowUpRightIcon,
  FileText,
  Loader2,
} from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const { query, setQuery, results, loading, error, reset } = useSearch();
  const { history, addToHistory } = useSearchHistory();
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Reset search when dialog closes - FIXED
  useEffect(() => {
    if (!open) {
      // Use setTimeout to avoid state update during render
      const timer = setTimeout(() => {
        reset();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  // Handle dialog open state changes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset immediately when manually closing
      reset();
    }
  };

  const handleResultSelect = (blog: any) => {
    setOpen(false);
    addToHistory(query);
    router.push(`/article/${blog.slug}`);
  };

  const handleHistorySelect = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        className="border-input max-w-xs mx-auto w-full bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-8 rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] hover:border-muted-foreground/30"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground font-normal truncate">
            Search
          </span>
        </span>
        <kbd className="bg-muted/50 text-muted-foreground ms-12 -me-1 inline-flex h-6 max-h-full items-center rounded border px-1.5 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search blog posts..."
          className="focus:ring-0 focus:outline-none border-0"
        />

        <CommandList className="max-h-[400px]">
          {/* Loading State */}
          {loading && (
            <div className="flex h-[200px] items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Searching...
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="py-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">{error}</div>
              <div className="text-xs text-muted-foreground/70">
                Please try again later
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && results.length === 0 && query.length >= 2 && (
            <CommandEmpty className="py-6 text-center">
              <div className="text-sm text-muted-foreground mb-1">
                No results found for "{query}"
              </div>
              <div className="text-xs text-muted-foreground/70">
                Try different keywords
              </div>
            </CommandEmpty>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <CommandGroup heading="Blog Posts">
              {results.map((blog) => (
                <CommandItem
                  key={blog.id}
                  value={blog.title}
                  onSelect={() => handleResultSelect(blog)}
                  className="flex flex-col items-start py-3 min-w-0 line-clamp-1" // Tambah min-w-0
                >
                  <div className="flex items-center">
                    <FileText size={16} className="opacity-60 me-2" />
                    <span className="truncate">{blog.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search History */}
          {!loading && history.length > 0 && query.length < 2 && (
            <CommandGroup heading="Recent Searches">
              {history.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleHistorySelect(item)}
                  className="flex items-center"
                >
                  <History size={16} className="opacity-60 me-3" />
                  <span className="truncate">{item}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Navigation Links */}
          <CommandGroup heading="Navigation">
            <CommandItem asChild>
              <Link
                href="/"
                className="flex items-center w-full"
                onClick={() => setOpen(false)}
              >
                <ArrowUpRightIcon size={16} className="opacity-60 me-3" />
                <span>Go to Home</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/articles"
                className="flex items-center w-full"
                onClick={() => setOpen(false)}
              >
                <ArrowUpRightIcon size={16} className="opacity-60 me-3" />
                <span>Browse All Articles</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/profile"
                className="flex items-center w-full"
                onClick={() => setOpen(false)}
              >
                <ArrowUpRightIcon size={16} className="opacity-60 me-3" />
                <span>Go to Profile</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
