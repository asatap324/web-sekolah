import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BlogPostCard } from "./blog-post-card";
import { FeaturedPostSidebarItem } from "./feature-post";

import Image from "next/image";

import { getSortedPostsData } from "@/lib/posts";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function BlogPage() {
  const latestPosts = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {latestPosts.slice(0, 1).map((item) => (
          <div
            key={item.id}
            className="relative h-[400px] overflow-hidden rounded-lg shadow-lg md:h-[600px] lg:col-span-2"
          >
            <Image
              src={item.heroImage}
              alt={item.title}
              width={700}
              height={475}
              className="aspect-square rounded-md object-cover w-full h-full"
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <Badge className="mb-2 w-fit bg-white/20 text-white backdrop-blur-sm">
                Business
              </Badge>
              <h2 className="text-2xl leading-tight font-bold md:text-3xl">
                {item.title}
              </h2>
            </div>
          </div>
        ))}

        {/* Other Featured Posts Sidebar */}
        <div className="bg-card text-card-foreground space-y-6 rounded-lg border p-6 lg:col-span-1">
          <h3 className="text-xl font-semibold">Other featured posts</h3>
          <div className="space-y-4 h-full">
            {latestPosts.slice(7, 11).map((item) => (
              <Link
                href={`/posts/${item.id}`}
                key={item.id}
                className="flex items-center gap-4"
              >
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  width={700}
                  height={475}
                  className="aspect-square rounded-md object-cover w-24"
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
                <h4 className="text-sm leading-snug line-clamp-3 font-medium">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Button variant="outline" asChild>
            <Link href="#">All Posts</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.slice(1, 7).map((item) => (
            <div key={item.id}>
              <BlogPostCard
                imageSrc={item.heroImage}
                imageAlt={item.title}
                title={item.title}
                description={item.description}
                authorName="Jennifer Taylor"
                authorAvatarSrc="/placeholder.svg?height=24&width=24"
                readTime="3 min"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
