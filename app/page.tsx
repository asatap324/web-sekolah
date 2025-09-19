import BlogPage from "@/components/blog/blog-page";
import { Spinner } from "@/components/ui/spinner";
import { getBlogs } from "@/lib/blogs";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Home() {
  const blogs = await getBlogs();
  return (
    <>
      <div className="relative min-h-screen bg-background">
        <div className="space-y-4 border-b border-border relative z-10">
          <div className="w-full max-w-7xl py-3  mx-auto relative sm:px-5 sm:py-3 mt-12 sm:mt-28">
            <div className="relative">
              <video
                className="w-full h-dvh sm:h-[800px]  sm:aspect-video object-cover brightness-75 sm:rounded-xl"
                src="/Homepage1.mp4"
                muted
                loop
                autoPlay
              />
              <div className="absolute w-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="container mx-auto overflow-hidden p-4 sm:p-6 lg:p-12 xl:p-24">
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl mb-3.5 text-white sm:text-4xl text-center uppercase font-extrabold">
                      SMP Negeri 04 Muncar Satu Atap
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-10">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2  max-w-7xl border-x border-border" />
          <div className="w-full overflow-hidden">
            <Suspense
              fallback={
                <div className="flex justify-center items-center min-h-[300px]">
                  <Spinner />
                  <span className="ml-2 text-foreground">Memuat blog...</span>
                </div>
              }
            >
              <BlogPage blogs={blogs ?? []} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
