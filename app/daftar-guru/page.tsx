import { Spinner } from "@/components/ui/spinner";
import { getGuru } from "@/lib/blogs";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Page() {
  const dataGuru = await getGuru();
  console.log(dataGuru);
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
        <span>halo</span>
      </Suspense>
    </>
  );
}
