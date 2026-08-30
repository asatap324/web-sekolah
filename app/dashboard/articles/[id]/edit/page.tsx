"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { BlogForm } from "@/components/dashboard/blog/shared/blog-form";
import { useBlogQueryById } from "@/hooks/use-content";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditBlogPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: blog, isLoading, isError } = useBlogQueryById(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-3">
        <Spinner variant="default" />
        <span>Memuat Artikel...</span>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">❌ Blog tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
        <p className="text-muted-foreground mt-1">
          Perbarui konten atau pengaturan artikel blog ini.
        </p>
      </div>
      <BlogForm
        mode="edit"
        initialData={blog}
        onSuccess={() => {
          router.push(`/dashboard/articles`);
        }}
      />
    </div>
  );
}
