import { AuthorCard } from "@/components/blog/author-card";
import { Button } from "@/components/ui/button";
import MyImage from "@/components/ui/image";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

import ReadMoreArticles from "@/components/blog/read-more-section";
import { TableOfContents } from "@/components/blog/table-of-content";
import { MobileTableOfContents } from "@/components/blog/mobile-toc";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import { FlickeringGrid } from "@/components/blocks/flickering-grid";

import { createServer } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/client";

export const revalidate = 3600;

interface BlogPageProps {
  params: { slug: string };
}

// Ambil data blog untuk halaman ini (SSG)
async function getBlogBySlug(slug: string) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("blogs")
    .select("slug, title, content, created_at, image_url, category")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// ✅ Pre-generate semua slug artikel
export async function generateStaticParams() {
  const supabase = createClient();
  const { data, error } = await supabase.from("blogs").select("slug");

  if (error || !data) return [];

  return data.map((blog) => ({
    slug: blog.slug,
  }));
}

// ✅ (Opsional) SEO dinamis per artikel
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;

  const supabase = createClient();

  const { data } = await supabase
    .from("blogs")
    .select("title, content, image_url")
    .eq("slug", slug)
    .single();

  if (!data) {
    return {
      title: "Blog tidak ditemukan",
    };
  }

  return {
    title: data.title,
    description: data.content.slice(0, 150),
    openGraph: {
      title: data.title,
      description: data.content.slice(0, 150) + "...",
      images: [
        {
          url: data.image_url || "https://example.com/default-og.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const date = new Date(blog.created_at);
  const formattedDate = formatDate(date);

  return (
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
      <div className="space-y-4 border-b border-border relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
            <Button variant="outline" asChild className="h-6 w-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to all articles</span>
              </Link>
            </Button>
            {blog.category && (
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                {blog.category.map((item: string) => (
                  <span
                    key={item}
                    className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            <time className="font-medium text-muted-foreground">
              {formattedDate}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
            {blog.title}
          </h1>
        </div>
      </div>
      <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
        <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
        <main className="w-full p-0 overflow-hidden">
          {blog.image_url && (
            <div className="relative w-full h-fit md:h-[500px] overflow-hidden object-cover border border-transparent">
              <MyImage
                src={blog.image_url}
                alt={blog.title}
                width={1000}
                height={500}
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6  lg:p-10">
            <div
              id="markdown-content"
              className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg"
            >
              <Markdown
                remarkPlugins={[remarkGfm, remarkSlug]}
                components={{
                  img: ({ node, ...props }) => (
                    <MyImage
                      src={typeof props.src === "string" ? props.src : ""}
                      alt={props.alt || ""}
                      width={800}
                      height={500}
                      className="rounded-md md:aspect-video md:object-cover"
                    />
                  ),
                }}
              >
                {blog.content}
              </Markdown>
            </div>
          </div>
          <div className="mt-10">
            <ReadMoreArticles currentSlug={slug} />
          </div>
        </main>

        <aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
          <div className="sticky top-20 space-y-8">
            <AuthorCard />

            <div className="border border-border rounded-lg p-6 bg-card">
              <TableOfContents />
            </div>
          </div>
        </aside>
      </div>

      <MobileTableOfContents />
    </div>
  );
}
