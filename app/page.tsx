import CarouselGuru from "@/components/blocks/guru-section";
import HeroSection from "@/components/blocks/hero-section";
import SambutanSection from "@/components/blocks/sambutan-section";
import BlogPage from "@/components/blocks/blog-section";

import { Spinner } from "@/components/ui/spinner";
import { getBlogs, getGuru } from "@/lib/blogs";

import { Suspense } from "react";

export const revalidate = 3600;

export default async function Home() {
  const dataGuru = await getGuru(7);
  const dataBlog = await getBlogs(9);

  return (
    <>
      <div className="relative min-h-screen bg-background z-10">
        <div className="space-y-4 border-b border-border relative z-10 mt-12 sm:mt-28">
          <HeroSection />
        </div>
        <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-10">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2  max-w-7xl border-x border-border" />
          <div className="w-full overflow-y-scroll z-10">
            <Suspense
              fallback={
                <div className="flex justify-center items-center min-h-[300px]">
                  <Spinner />
                  <span className="ml-2 text-foreground">Memuat blog...</span>
                </div>
              }
            >
              <BlogPage blogs={dataBlog} />
            </Suspense>
            <SambutanSection />
            <div className="max-w-7xl mx-auto py-6 md:px-5">
              <CarouselGuru items={dataGuru} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
