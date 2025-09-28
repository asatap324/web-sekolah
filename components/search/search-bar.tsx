"use client";

import * as React from "react";
import { ArrowUpRightIcon, History, SearchIcon } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { searchBlogs } from "@/app/actions/search-blogs";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BlogResult = {
  id: string;
  title: string;
  slug: string;
};

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [cache, setCache] = useState<Map<string, BlogResult[]>>(new Map());
  const [history, setHistory] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("search-history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 🔎 Fetch blogs tiap kali query berubah
  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 2) {
        setResults([]);
        return;
      }

      // 🔹 cek cache dulu
      if (cache.has(q)) {
        setResults(cache.get(q)!);
        return;
      }

      // 🔹 abort request sebelumnya kalau ada
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const data = await searchBlogs(q, { signal: controller.signal });
        setResults(data);

        // simpan ke cache
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(q, data);
          return newCache;
        });
      } catch (err: any) {
        if (err.name === "AbortError") {
          // request dibatalkan → aman diabaikan
          return;
        }
        console.error("Search error:", err.message);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, cache]);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    setHistory((prev) => {
      const updated = [q, ...prev.filter((h) => h !== q)].slice(0, 5); // max 5
      localStorage.setItem("search-history", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <button
        className="border-input  max-w-xs mx-auto w-full  bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-8  rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">
            Search...
          </span>
        </span>
        <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-6 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Type a command or search..."
        />
        <CommandList>
          {results.length === 0 && query.length >= 2 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          <CommandGroup>
            {results.map((blog) => (
              <CommandItem
                key={blog.id}
                onSelect={() => {
                  setOpen(false);
                  addToHistory(query);
                  router.push(`/article/${blog.slug}`);
                }}
              >
                {blog.title}
              </CommandItem>
            ))}
          </CommandGroup>
          {history.length > 0 && query.length < 2 && (
            <CommandGroup heading="Recent Searches">
              {history.map((h) => (
                <CommandItem
                  key={h}
                  onSelect={() => {
                    setQuery(h);
                  }}
                >
                  <History size={16} className="opacity-60 me-2" />
                  {h}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Navigation">
            <CommandItem asChild>
              <Link className="flex items-center" href="/">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Home</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link className="flex items-center" href="/articles">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Article</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link className="flex items-center" href="/profile">
                <ArrowUpRightIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Go to Profile</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
