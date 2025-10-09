"use client";
import dynamic from "next/dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import UploadThumbnails from "@/components/dashboard-ui/blog-form-ui/file-upload";

import { createClient } from "@/utils/supabase/client";
import { CategoryInput } from "../input-tag";
import { useCreateBlog } from "@/hooks/blogs/mutations";

const Editor = dynamic(
  () => import("../../../blocks/editor-00/editor").then((m) => m.Editor),
  {
    ssr: false,
  },
);
const blogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  category: z.array(z.string()).nonempty("Minimal 1 kategori"),
  image: z.any(),
});

type BlogForm = z.infer<typeof blogSchema>;

export default function CreateBlogForm() {
  const createBlog = useCreateBlog();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      category: [],
      image: "",
    },
  });

  const onSubmit = async (values: BlogForm) => {
    try {
      let image: { url: string; path: string } | undefined = undefined;

      if (file) {
        const supabase = createClient();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `blogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        image = { url: data.publicUrl, path: filePath };
      }

      // 🔹 Panggil mutation TanStack
      createBlog.mutate(
        {
          title: values.title,
          content: values.content,
          category: values.category,
          image,
        },
        {
          onSuccess: () => {
            form.reset();
            setFile(null);
            toast.success("Blog berhasil dibuat!");
          },
          onError: (err: any) => {
            toast.error(err.message || "Gagal membuat blog");
          },
        },
      );
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat blog");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container space-y-6 max-w-full mx-auto h-full"
      >
        <div className="space-y-3.5">
          <div className="w-full flex flex-col md:flex-row items-start justify-center gap-4">
            <div className="grid gap-6 md:flex-1 w-full md:w-fit">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <UploadThumbnails onFileSelect={setFile} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul blog..." {...field} />
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
                      <CategoryInput
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                <FormItem className="md:flex-1">
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Editor
                      initialMarkdown={field.value} // kosong saat create
                      onMarkdownChange={field.onChange} // langsung sync ke form
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="md:fixed bottom-10 w-full md:w-1/4">
          <Button
            type="submit"
            disabled={createBlog.isPending}
            className="w-full"
          >
            {createBlog.isPending ? "⏳ Membuat..." : "Buat Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
