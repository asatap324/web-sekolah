import { createServer } from "@/utils/supabase/server";
import type { Metadata } from "next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import MyImage from "@/components/ui/image";
import { FlickeringGrid } from "@/components/blocks/flickering-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Lihat koleksi foto kegiatan, fasilitas, dan prestasi SMP Negeri 04 Muncar Satu Atap Banyuwangi.",
  keywords: [
    "galeri foto sekolah",
    "kegiatan sekolah",
    "foto fasilitas",
    "prestasi siswa",
  ],

  openGraph: {
    title: "Galeri Foto",
    description:
      "Kumpulan foto kegiatan dan fasilitas SMP Negeri 04 Muncar Satu Atap",
    url: "https://smpn4muncarsatuatap.sch.id/profile",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-galeri.png",
        width: 1200,
        height: 630,
        alt: "Galeri SMP Negeri 04 Muncar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galeri Foto",
    description:
      "Kumpulan foto kegiatan dan fasilitas SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-galeri.png",
        width: 1200,
        height: 630,
        alt: "Galeri SMP Negeri 04 Muncar",
      },
    ],
  },
  alternates: {
    canonical: "https://smpn4muncarsatuatap.sch.i/gallery",
  },
};

export const revalidate = 3600;

export default async function Page({ searchParams }: Props) {
  const supabase = await createServer();
  const search = await searchParams;

  const page = Number(search.page) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  // Query tabel metadata
  const { data: files, count } = await supabase
    .from("blogs")
    .select("id, image_url, slug", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  const totalPages = count ? Math.ceil(count / perPage) : 1;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      <div className="min-h-screen bg-background relative mt-16 sm:mt-28">
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
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter max-w-4xl mb-2">
              Galeri SMP Negeri 04 Muncar Satu Atap
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base lg:text-lg">
              Mewujudkan pengembangan bakat minat peserta didik sesuai dengan
              kemampuan dasarnya dalam bidang kegiatan ekstrakurikuler.
            </p>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-0">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />{" "}
          <div
            className={`w-full overflow-y-hidden z-10 p-6 gap-4 columns-1 sm:columns-3`}
          >
            {files?.map((file) => {
              return (
                <Link key={file.id} href={`/article/${file.slug}`}>
                  <div className="relative">
                    <MyImage
                      src={file.image_url}
                      alt="Gallery Image"
                      width={800}
                      height={600}
                      className="rounded-lg object-cover size-full mb-4"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="justify-center hidden md:flex p-6 z-20">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`?page=${page - 1}`}
                        aria-disabled={page === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`?page=${i + 1}`}
                          isActive={page === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={`?page=${page + 1}`}
                        aria-disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="max-w-xl flex mx-auto justify-between md:hidden items-center px-10 md:p-6 z-20">
                <p
                  className="text-muted-foreground grow text-sm"
                  aria-live="polite"
                >
                  Page <span className="text-foreground">{page}</span> of{" "}
                  <span className="text-foreground">{totalPages}</span>
                </p>
                <Pagination className="w-auto">
                  <PaginationContent className="gap-3">
                    <PaginationItem>
                      <Button
                        variant="outline"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        aria-disabled={page === 1 ? true : undefined}
                        role={page === 1 ? "link" : undefined}
                        asChild
                      >
                        <a href={`?page=${page - 1}`}>Previous</a>
                      </Button>
                    </PaginationItem>

                    <PaginationItem>
                      <Button
                        variant="outline"
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        aria-disabled={page === totalPages ? true : undefined}
                        role={page === totalPages ? "link" : undefined}
                        asChild
                      >
                        <a href={`?page=${page + 1}`}>Next</a>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}
