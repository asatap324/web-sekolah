import { LogoutButton } from "@/components/auth-ui/logout-button";
import BlogPage from "@/components/blog/blog-page";
import SearchBar from "@/components/search/search-bar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-7xl mx-auto relative sm:px-5 sm:py-3 mt-16">
        <video
          className="w-full h-dvh sm:h-[800px] sm:aspect-video object-cover brightness-75 sm:rounded-xl"
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
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <BlogPage />
      </div>
    </>
  );
}
