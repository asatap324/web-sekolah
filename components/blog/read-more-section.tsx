"use client";

import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import removeMd from "remove-markdown";
import MyImage from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";

interface ReadMoreArticlesProps {
  currentSlug: string;
  limit?: number;
}

const fetcher = async (slug: string, limit: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, created_at, image_url, content")
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ReadMoreArticles({
  currentSlug,
  limit = 3,
}: ReadMoreArticlesProps) {
  const {
    data: moreArticles,
    error,
    isLoading,
  } = useSWR(
    [{ key: "readMoreArticles", currentSlug, limit }],
    () => fetcher(currentSlug, limit),
    { revalidateOnFocus: false, dedupingInterval: 1000 * 60 }, // cache 1 menit
  );

  if (error) return <p className="text-red-500">Gagal memuat artikel lain.</p>;
  if (!moreArticles || moreArticles.length === 0) return null;

  return (
    <>
      {isLoading ? (
        <>
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        </>
      ) : (
        <section className="border-t border-border p-0">
          <div className="p-6 lg:p-10">
            <h2 className="text-2xl font-medium mb-8">Read more</h2>

            <div className="flex flex-col gap-8">
              {moreArticles.map((post) => (
                <Link
                  key={post.id}
                  href={`/article/${post.slug}`}
                  aria-label="related-articles"
                  className="group grid grid-cols-1 lg:grid-cols-12 items-center gap-4 cursor-pointer"
                >
                  {post.image_url && (
                    <div className="flex-shrink-0 col-span-1 lg:col-span-4">
                      <div className="relative w-full h-full">
                        <MyImage
                          src={post.image_url}
                          alt={post.title}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover aspect-video rounded-lg group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 flex-1 col-span-1 lg:col-span-8">
                    <h3 className="text-lg group-hover:underline underline-offset-4 font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 group-hover:underline underline-offset-4">
                      {removeMd(post.content ?? "").slice(0, 100)}
                    </p>
                    <time className="block text-xs font-medium text-muted-foreground">
                      {formatDate(post.created_at)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
