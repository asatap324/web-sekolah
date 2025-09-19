"use client";

import * as React from "react";
import { ArrowUpRightIcon, SearchIcon } from "lucide-react";

import { useState, useEffect } from "react";

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

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [cache, setCache] = useState<Map<string, any[]>>(new Map());
  const router = useRouter();

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
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      // cek cache
      if (cache.has(query)) {
        setResults(cache.get(query)!);
        return;
      }

      // fetch ke Supabase
      const data = await searchBlogs(query);
      setResults(data);

      // simpan ke cache
      setCache((prev) => new Map(prev).set(query, data));
    }, 500);

    return () => clearTimeout(handler); // cleanup
  }, [query, cache]);

  return (
    <>
      <button
        className="border-input  max-w-xs mx-auto w-full  bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9  rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
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
                  router.push(`/article/${blog.slug}`);
                }}
              >
                {blog.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to Home</span>
            </CommandItem>
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to Article</span>
            </CommandItem>
            <CommandItem>
              <ArrowUpRightIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Go to Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
