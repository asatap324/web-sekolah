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

import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { FlickeringGrid } from "@/components/blocks/flickering-grid";
import CardGuru from "@/components/blocks/daftar-guru/card-guru";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Daftar Guru",
  description: "Daftar guru SMP Negeri 04 Muncar Satu Atap",
  openGraph: {
    title: "Daftar Guru",
    description: "Daftar guru SMP Negeri 04 Muncar Satu Atap",
    url: "https://smpn4muncarsatuatap.sch.id/article",
    siteName: "SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://example.com/og-article.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function Page({ searchParams }: Props) {
  const supabase = await createServer();
  const search = await searchParams;

  const page = Number(search.page) || 1;
  const perPage = 6;
  const offset = (page - 1) * perPage;

  // query guru (paginated)
  let query = supabase
    .from("guru")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true })
    .range(offset, offset + perPage - 1);

  const { data: guruRaw, count } = await query;
  const dataGuru = guruRaw ?? [];
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
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter max-w-4xl">
              Daftar Guru dan Staff SMP Negeri 04 Muncar Satu Atap
            </h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
              Our school.
            </p>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-0">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />{" "}
          <div
            className={`w-full overflow-y-scroll z-10 p-6 gap-4 grid grid-cols-1 md:grid-cols-3 ${
              dataGuru?.length < 4 ? "border-b" : "border-b-0"
            }`}
          >
            {dataGuru.map((item: any) => (
              <CardGuru
                key={item.id}
                image_url={item.image_url}
                nama={item.nama}
                role={item.role}
              />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center p-6 z-20">
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
          )}
        </div>
      </div>
    </Suspense>
  );
}
