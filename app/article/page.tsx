import BlogList from "@/components/blocks/blog-list";
import { Spinner } from "@/components/ui/spinner";
import { getBlogs } from "@/lib/blogs";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner />
            <span className="ml-2 text-foreground">Memuat blog...</span>
          </div>
        }
      >
        <BlogList blogs={blogs ?? []} />
      </Suspense>
    </>
  );
}
