// components/search-bar.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
  SearchIcon,
  History,
  ArrowUpRightIcon,
  FileText,
  Loader2,
  CornerDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPopup, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SearchBar() {
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
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger
          render={
            <Button
              onClick={() => setOpen(true)}
              aria-label="Open search"
              variant="outline"
              className="w-full"
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
            </Button>
          }
        />
        <DialogPopup className="p-3 pb-13 sm:max-w-xl" showCloseButton={false}>
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search blog posts..."
            />
            <CommandList className="no-scrollbar min-h-76 scroll-pt-2 scroll-pb-1.5 pt-1">
              {loading && (
                <div className="flex h-[200px] items-center justify-center py-8 text-sm text-muted-foreground">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Searching...
                </div>
              )}

              {error && !loading && (
                <div className="py-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    {error}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    Please try again later
                  </div>
                </div>
              )}

              {!loading &&
                !error &&
                results.length === 0 &&
                query.length >= 2 && (
                  <CommandEmpty className="py-12 text-center text-muted-foreground text-sm">
                    <div className="text-sm text-muted-foreground mb-1">
                      No results found for "{query}"
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      Try different keywords
                    </div>
                  </CommandEmpty>
                )}

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
                        <FileText size={16} className="opacity-75 me-2" />
                        <span className="truncate">{blog.title}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

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
          </Command>
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-b-xl border-t bg-muted px-4 py-3 text-muted-foreground text-xs">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CommandMenuKbd>
                <CornerDownLeft strokeWidth={2} />
              </CommandMenuKbd>{" "}
              Go to Page
            </div>
          </div>
        </DialogPopup>
      </Dialog>
      {/* Search Trigger Button */}

      {/* Search Dialog */}
    </>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium font-sans text-[0.7rem] text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}
