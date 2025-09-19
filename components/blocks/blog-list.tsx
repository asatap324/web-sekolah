"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryFilter } from "./category-filter";
import { FlickeringGrid } from "./flickering-grid";
import { BlogCard } from "./blog-card";
import removeMd from "remove-markdown";

import { Button } from "../ui/button";

interface BlogListProps {
  blogs: any[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const searchParams = useSearchParams();

  // ambil nilai dari URL (?tag=Tech)
  const initialTag = searchParams.get("tag") || "Semua Kategori";
  const [selectedTag, setSelectedTag] = useState(initialTag);

  useEffect(() => {
    setSelectedTag(searchParams.get("tag") || "Semua Kategori");
  }, [searchParams]);

  const allTags = [
    "Semua Kategori",
    ...Array.from(new Set(blogs.flatMap((b) => b.category || []))).sort(),
  ];

  const filteredBlogs =
    selectedTag === "Semua Kategori"
      ? blogs
      : blogs.filter((b) => b.category?.includes(selectedTag));

  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] =
        tag === "Semua Kategori"
          ? blogs.length
          : blogs.filter((b) => b.category?.includes(tag)).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-background relative mt-16  sm:mt-28">
        <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>
        <div className="p-6 border-b border-border flex flex-col gap-6 min-h-[250px] justify-center relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
                Magic UI Blog
              </h1>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
                Latest news and updates from Magic UI.
              </p>
            </div>
          </div>
          <div className="max-w-7xl w-full mx-auto">
            <CategoryFilter
              tags={allTags}
              selectedTag={selectedTag}
              tagCounts={tagCounts}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-0">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${
              filteredBlogs.length < 4 ? "border-b" : "border-b-0"
            }`}
          >
            {filteredBlogs.map((blog) => {
              const date = new Date(blog.created_at);
              const formattedDate = formatDate(date);

              return (
                <BlogCard
                  key={blog.id}
                  slug={blog.slug}
                  title={blog.title}
                  description={removeMd(blog.content ?? "").slice(0, 100)}
                  date={formattedDate}
                  thumbnail={blog.image_url}
                  showRightBorder={filteredBlogs.length < 3}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
