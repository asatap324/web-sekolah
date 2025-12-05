// app/article/page.tsx

import { createServer } from "@/utils/supabase/server";
import type { Metadata } from "next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BlogCard, CategoryFilter } from "@/components/blog";
import removeMd from "remove-markdown";
import { FlickeringGrid } from "@/components/shared";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Kumpulan berita terbaru, artikel pendidikan, dan informasi terkini dari SMP Negeri 04 Muncar Satu Atap Banyuwangi.",
  keywords: [
    "berita sekolah",
    "artikel pendidikan",
    "informasi terbaru",
    "kegiatan sekolah",
  ],
  openGraph: {
    title: "Berita & Artikel",
    description:
      "Informasi terbaru dan artikel pendidikan dari SMP Negeri 04 Muncar Satu Atap",
    url: "https://smpn4muncarsatuatap.sch.id/articles",
    siteName: "SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-articles.png",
        width: 1200,
        height: 630,
        alt: "Berita & Artikel SMP Negeri 04 Muncar Satu Atap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita & Artikel",
    description:
      "Informasi terbaru dan artikel pendidikan dari SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-articles.png",
        width: 1200,
        height: 630,
        alt: "Berita & Artikel SMP Negeri 04 Muncar Satu Atap",
      },
    ],
  },
  alternates: {
    canonical: "https://smpn4muncarsatuatap.sch.id/articles",
  },
};

type Props = {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
};

export default async function ArticlePage({ searchParams }: Props) {
  const supabase = await createServer();
  const search = await searchParams;

  const page = Number(search.page) || 1;
  const perPage = 6;
  const offset = (page - 1) * perPage;
  const selectedTag = search.tag || "Semua Kategori";

  // query blogs (paginated)
  let query = supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (selectedTag !== "Semua Kategori") {
    query = query.contains("category", [selectedTag]); // karena category disimpan array
  }

  const { data: blogsRaw, count } = await query;
  const blogs = blogsRaw ?? [];
  const totalPages = count ? Math.ceil(count / perPage) : 1;

  // ambil semua tag untuk filter
  const { data: allBlogs } = await supabase.from("blogs").select("category");
  const allTags = [
    "Semua Kategori",
    ...Array.from(new Set(allBlogs?.flatMap((b) => b.category || []))).sort(),
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-sidebar relative mt-16 sm:mt-28">
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
      {/* Header */}
      <div className="p-6 border-b border-border flex flex-col gap-6 min-h-[250px] justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
            Artikel Dan Berita
          </h1>
          <p className="text-muted-foreground max-w-4xl text-sm md:text-base lg:text-lg">
            Berita dan pembaruan terbaru dari SMP Negeri 04 Muncar Satu Atap.
          </p>
        </div>
        <div className="max-w-7xl w-full mx-auto">
          <CategoryFilter tags={allTags} selectedTag={selectedTag} />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-0">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${
            blogs?.length < 4 ? "border-b" : "border-b-0"
          }`}
        >
          {blogs?.map((blog) => (
            <BlogCard
              key={blog.id}
              slug={blog.slug}
              title={blog.title}
              description={removeMd(blog.content ?? "").slice(0, 100)}
              date={formatDate(blog.created_at)}
              thumbnail={blog.image_url}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${page - 1}&tag=${selectedTag}`}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`?page=${i + 1}&tag=${selectedTag}`}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={`?page=${page + 1}&tag=${selectedTag}`}
                    aria-disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
