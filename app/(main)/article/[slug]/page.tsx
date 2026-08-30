import { Button } from "@/components/ui/button";
import MyImage from "@/components/ui/image";
import type { Metadata } from "next";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

import {
  AuthorCard,
  MobileTableOfContents,
  ReadMoreArticles,
  TableOfContents,
} from "@/components/blog";

import { FlickeringGrid, SocialShareButtons } from "@/components/shared";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";

import { ArticleStructuredData } from "@/components/structured-data";
import { createServer, createStaticClient } from "@/utils/supabase/server";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

// Ambil data blog untuk halaman ini (SSG)
async function getBlogBySlug(slug: string) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("blogs")
    .select("slug, title, content, created_at, image_url, category")
    .eq("is_archived", false)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function getRelatedArticles(
  currentSlug: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, created_at, image_url, content")
    .eq("is_archived", false)
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }

  return data || [];
}

// Pre-generate semua slug artikel
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("slug")
    .eq("is_archived", false);

  if (error || !data) return [];

  return data.map((blog) => ({
    slug: blog.slug,
  }));
}

// SEO dinamis per artikel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const supabase = createStaticClient();

  const { data } = await supabase
    .from("blogs")
    .select("title, content, image_url, created_at")
    .eq("is_archived", false)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return {
      title: "Artikel Tidak Ditemukan - SMP Negeri 04 Muncar Satu Atap",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = data.content.slice(0, 160);
  const imageUrl = data.image_url || "og-image.png";
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `https://smpn4muncarsatuatap.sch.id/${imageUrl}`;

  return {
    title: data.title,
    description: description,
    keywords: [
      data.title,
      "blog pendidikan",
      "artikel sekolah",
      "SMP Negeri 4 Muncar",
      "sekolah Banyuwangi",
    ],
    openGraph: {
      title: data.title,
      description: description + "...",
      type: "article",
      publishedTime: data.created_at,
      authors: "SMP Negeri 04 Muncar Satu Atap",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: description + "...",
      images: [fullImageUrl],
    },
    alternates: {
      canonical: `https://smpn4muncarsatuatap.sch.id/article/${slug}`,
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [blog, relatedArticles] = await Promise.all([
    getBlogBySlug(slug),
    getRelatedArticles(slug, 3),
  ]);

  if (!blog) {
    notFound();
  }

  const date = new Date(blog.created_at);
  const formattedDate = formatDate(date);

  return (
    <>
      <ArticleStructuredData data={blog} />
      <div className="min-h-screen bg-sidebar relative mt-16  sm:mt-28">
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
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                render={<Link href="/" />}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to all articles</span>
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
              <div className="relative w-full h-64 md:h-[500px] flex items-center justify-center overflow-hidden bg-muted/30 border-b border-border/50">
                <MyImage
                  src={blog.image_url}
                  alt={blog.title}
                  width={1000}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            )}
            <div className="p-6 lg:p-10">
              <div
                id="markdown-content"
                className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg"
              >
                <Markdown
                  remarkPlugins={[remarkGfm, remarkSlug]}
                  components={{
                    p: ({ node, ...props }) => <p dir="auto" {...props} />,
                    h1: ({ node, ...props }) => <h1 dir="auto" {...props} />,
                    h2: ({ node, ...props }) => <h2 dir="auto" {...props} />,
                    h3: ({ node, ...props }) => <h3 dir="auto" {...props} />,
                    h4: ({ node, ...props }) => <h4 dir="auto" {...props} />,
                    h5: ({ node, ...props }) => <h5 dir="auto" {...props} />,
                    h6: ({ node, ...props }) => <h6 dir="auto" {...props} />,
                    li: ({ node, ...props }) => <li dir="auto" {...props} />,
                    img: ({ node, ...props }) => (
                      <img
                        src={typeof props.src === "string" ? props.src : ""}
                        alt={props.alt || ""}
                        width={800}
                        height={500}
                        loading="lazy"
                        className="rounded-lg w-full h-auto max-h-[500px] object-contain"
                      />
                    ),
                  }}
                >
                  {blog.content}
                </Markdown>
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-bold tracking-tight mb-3.5">
                  Bagikan Artikel Ini
                </h3>
                <SocialShareButtons />
              </div>
            </div>
            <div className="mt-10 lg:hidden">
              <ReadMoreArticles moreArticles={relatedArticles} />
            </div>
          </main>

          <aside className="hidden lg:block w-[350px] flex-shrink-0  bg-muted/60 dark:bg-muted/20">
            <div className="sticky top-20 space-y-8">
              <div className="px-6 pt-10 space-y-6">
                <AuthorCard />

                <div className="border border-border rounded-lg p-6 bg-card">
                  <TableOfContents />
                </div>
              </div>
              <ReadMoreArticles moreArticles={relatedArticles} />
            </div>
          </aside>
        </div>

        <MobileTableOfContents />
      </div>
    </>
  );
}
