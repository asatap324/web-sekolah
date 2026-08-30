import { BlogForm } from "@/components/dashboard/blog/shared/blog-form";

export default function CreateBlogPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tulis Blog Baru</h1>
        <p className="text-muted-foreground mt-1">
          Buat artikel baru untuk dipublikasikan ke siswa dan guru.
        </p>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
