// app/blogs/[id]/edit/EditBlogPageClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import EditBlogForm from "./form-edit-blog";
import { useBlogQueryById } from "@/hooks/blogs/queries";

export default function EditBlogPageClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: blog, isLoading, isError } = useBlogQueryById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
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
    <div className="container max-w-full py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <EditBlogForm
        blog={blog}
        onSuccess={() => {
          router.push(`/blogs/${id}`);
        }}
      />
    </div>
  );
}
