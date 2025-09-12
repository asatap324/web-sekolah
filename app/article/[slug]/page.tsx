import { AuthorCard } from "@/components/blog/author-card";
import { Button } from "@/components/ui/button";
import MyImage from "@/components/ui/image";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

import ReadMoreArticles from "@/components/blog/read-more-section";

interface BlogPageProps {
  params: { slug: string };
}

// Ambil data blog untuk halaman ini (SSG)
async function getBlogBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
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
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog tidak ditemukan",
    };
  }

  return {
    title: blog.title,
    description: blog.description ?? blog.content.slice(0, 150) + "...",
  };
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
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
      <div className="space-y-4 border-b border-border relative z-10">
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
                <span className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center">
                  {blog.category}
                </span>
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
            <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
              <Markdown>{blog.content}</Markdown>
            </div>
          </div>
          <div className="mt-10">
            <ReadMoreArticles currentSlug={params.slug} />
          </div>
        </main>

        <aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
          <div className="sticky top-20 space-y-8">
            <AuthorCard />

            {/*<div className="border border-border rounded-lg p-6 bg-card">
              <TableOfContents />
            </div>*/}
          </div>
        </aside>
      </div>

      {/*<MobileTableOfContents />*/}
    </div>
  );
}
