"use client";
import Link from "next/link";
import MyImage from "@/components/ui/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BlogPostCard } from "./blog-post-card";

import removeMd from "remove-markdown";

import { useBlogs } from "@/hooks/use-blogs";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function BlogPage() {
  const { getBlogs } = useBlogs();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const data = await getBlogs();
        if (!ignore) {
          setBlogs(data);
        }
      } catch (err: any) {
        // Kalau ada name = AbortError → abaikan
        if (err?.name === "AbortError") return;

        // Kalau objek biasa (bukan Error), coba tampilkan lebih jelas
        if (err instanceof Error) {
          console.error("Error:", err.message, err.stack);
        } else {
          console.error("Unknown error:", JSON.stringify(err));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true; // cegah state update setelah unmount
    };
  }, [getBlogs]);
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {loading ? (
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full md:w-[800px] rounded-lg shadow-lg md:h-[600px] " />
          </div>
        ) : (
          <>
            {blogs.slice(0, 1).map((item) => (
              <div
                key={item.id}
                className="relative h-[400px] overflow-hidden rounded-lg shadow-lg md:h-[600px] lg:col-span-2"
              >
                <MyImage
                  src={item.image_url}
                  alt={item.title}
                  width={700}
                  height={475}
                  className="aspect-square rounded-md object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <Badge className="mb-2 w-fit bg-white/20 text-white backdrop-blur-sm">
                    {item.category}
                  </Badge>
                  <h2 className="text-2xl leading-tight font-bold md:text-3xl">
                    {item.title}
                  </h2>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Other Featured Posts Sidebar */}
        <div className="bg-card text-card-foreground space-y-6 rounded-lg border p-6 lg:col-span-1">
          {loading ? (
            <>
              <Skeleton className="w-[200px] rounded-lg h-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="mt-5 flex items-start gap-4">
                    <Skeleton className="w-24 h-24 rounded-md aspect-square" />
                    <div className="space-y-3.5">
                      <Skeleton className="h-4 w-[220px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold">Other featured posts</h3>
              <div className="space-y-4 h-full">
                {blogs.map((item) => (
                  <Link
                    href={`/article/${item.slug}`}
                    key={item.id}
                    className="flex items-start gap-4"
                  >
                    <MyImage
                      src={item.image_url}
                      alt={item.title}
                      width={700}
                      height={475}
                      className="aspect-square rounded-md object-cover w-24"
                    />
                    <h4 className="text-sm leading-snug line-clamp-3 font-medium">
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="mt-12">
        {loading ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-44 w-full md:w-80" />
                  <div className="space-y-3.5 mt-3.5">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              <Button variant="outline" asChild>
                <Link href="#">All Posts</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((item) => (
                <div key={item.id}>
                  <BlogPostCard
                    imageSrc={item.image_url}
                    imageAlt={item.title}
                    title={item.title}
                    description={removeMd(item.content ?? "").slice(0, 100)}
                    authorName="Admin"
                    readTime="3 min"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
