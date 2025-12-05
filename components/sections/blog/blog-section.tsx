import Link from "next/link";

import MyImage from "@/components/ui/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BlogPostCard } from "@/components/blog";

import removeMd from "remove-markdown";

export function BlogSection({ blogs }: { blogs?: any[] }) {
  return (
    <div className="relative max-w-7xl mx-auto md:px-6 z-10">
      <div className="w-full p-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 p-6">
          {blogs?.slice(0, 1).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className="relative overflow-hidden rounded-lg shadow-lg md:h-[600px] lg:col-span-2 group"
            >
              <MyImage
                src={item.image_url}
                alt={item.title.slice(0, 20)}
                width={700}
                height={475}
                priority={true}
                fetchPriority="high"
                className="aspect-square rounded-md w-full object-cover group-hover:opacity-80 transition-opacity"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw "
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

                <h2 className="text-2xl leading-tight font-bold md:text-3xl line-clamp-2 md:line-clamp-none">
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
          {/* Other Featured Posts Sidebar */}
          <div className="relative flex min-w-0 flex-col rounded-2xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72 lg:col-span-1">
            <div className="-m-px border bg-background p-2 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] rounded-t-2xl rounded-b-xl dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  Postingan terpilih lainnya
                </h3>
                <div className="space-y-4 h-full pt-5">
                  {blogs?.slice(5, 9).map((item) => (
                    <Link
                      href={`/article/${item.slug}`}
                      key={item.id}
                      className="flex items-start gap-4 group"
                    >
                      <MyImage
                        src={item.image_url}
                        alt={item.title.slice(0, 20)}
                        width={700}
                        height={475}
                        className="aspect-square rounded-md object-cover w-24 group-hover:opacity-80 transition-opacity"
                        sizes="(max-width: 768px) 20vw, (max-width: 1200px) 15vw, 10vw"
                      />
                      <h4 className="text-sm leading-snug line-clamp-3 font-medium">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 rounded-b-2xl flex justify-between items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/articles" />}
              >
                Read More
              </Button>
              <div className="flex items-center gap-2">
                {/*<Avatar className="h-4 w-4">
            <AvatarFallback className="text-xs">
              {authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>*/}

                <span className="text-sm">Posted by Admin</span>
                {/*<span>•</span>
          <span className="text-sm">{readTime} read</span>*/}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mt-5 px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Berita Terbaru</h2>
            <Button variant="outline" render={<Link href="/articles" />}>
              Lihat semua
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
                  publishedAt={item.created_at}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
