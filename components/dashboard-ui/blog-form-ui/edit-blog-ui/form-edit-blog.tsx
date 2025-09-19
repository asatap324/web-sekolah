"use client";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useBlogs } from "@/hooks/use-blogs";
import UploadThumbnails from "@/components/dashboard-ui/blog-form-ui/file-upload";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, LoaderCircleIcon } from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Content is required"),
  category: z.string().min(2, "Category is required"),
  image: z.any(),
});

const Editor = dynamic(
  () => import("../../../blocks/editor-00/editor").then((m) => m.Editor),
  {
    ssr: false,
  },
);

type FormValues = z.infer<typeof blogSchema>;

export default function EditBlogForm({ blog }: { blog: any }) {
  const { updateBlog } = useBlogs();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      content: blog?.content ?? "",
      category: blog?.category ?? "",
      image: blog?.image_url ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setSuccess(false);

      let image = blog?.image;

      if (file) {
        const supabase = createClient();
        const filePath = `blogs/${file.name}`;

        // upload image baru
        const { error } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        image = {
          url: data.publicUrl,
          path: filePath,
        };

        // hapus gambar lama kalau ada
        if (blog?.image?.path) {
          await supabase.storage.from("blog-images").remove([blog.image.path]);
        }
      }

      await updateBlog(blog.id, {
        title: values.title,
        content: values.content,
        category: values.category,
        image,
      });

      toast.success("Blog berhasil diupdate!");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "❌ Gagal update blog");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container space-y-6 max-w-full mx-auto h-full"
      >
        <div className="space-y-3.5">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <UploadThumbnails
                  onFileSelect={setFile}
                  initialUrl={blog?.image_url || null} // 👉 thumbnail lama
                />
              </FormItem>
            )}
          />

          <div className="flex items-start justify-center gap-4">
            <div className="grid gap-6 flex-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan judul blog..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Agenda Sekolah" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Editor
                      initialMarkdown={field.value}
                      onMarkdownChange={(markdown: any) => {
                        field.onChange(markdown);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="fixed bottom-10 w-full">
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              success && "bg-green-600 hover:bg-green-700 text-white",
            )}
          >
            {loading ? (
              <>
                <LoaderCircleIcon
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Please wait...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Success!
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
