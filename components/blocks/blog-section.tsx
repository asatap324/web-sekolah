import Link from "next/link";

import MyImage from "@/components/ui/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BlogPostCard } from "@/components/blog/blog-post-card";

import removeMd from "remove-markdown";

export default function BlogPage({ blogs }: { blogs?: any[] }) {
  return (
    <div className="relative max-w-7xl mx-auto md:px-6 z-10">
      <div className="w-full p-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 p-6">
          {blogs?.slice(0, 1).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
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
                <div className="flex items-center gap-2">
                  {item.category.map((item: string) => (
                    <Badge
                      key={item}
                      className="mb-2 w-fit bg-white/20 text-white backdrop-blur-sm"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>

                <h2 className="text-2xl leading-tight font-bold md:text-3xl">
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}

          {/* Other Featured Posts Sidebar */}
          <div className="bg-card text-card-foreground space-y-6 rounded-lg border p-6 lg:col-span-1">
            <h3 className="text-xl font-semibold">Other featured posts</h3>
            <div className="space-y-4 h-full">
              {blogs?.slice(5, 9).map((item) => (
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
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mt-5 px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Button variant="outline" asChild>
              <Link href="#">All Posts</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.slice(1, 4).map((item) => (
              <Link href={`/article/${item.slug}`} key={item.id}>
                <BlogPostCard
                  imageSrc={item.image_url}
                  imageAlt={item.title}
                  title={item.title}
                  description={removeMd(item.content ?? "").slice(0, 100)}
                  authorName="Admin"
                  readTime="3 min"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
