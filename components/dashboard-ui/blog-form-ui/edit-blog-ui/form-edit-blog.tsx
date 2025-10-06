"use client";
import dynamic from "next/dynamic";
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
import UploadThumbnails from "@/components/dashboard-ui/blog-form-ui/file-upload";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUpdateBlog } from "@/hooks/blogs/mutations";
import { CategoryInput } from "../input-tag";

interface UpdateBlogFormProps {
  blog: {
    id: string;
    title: string;
    content: string;
    category: string[];
    image_url?: string | null;
    image_path?: string | null;
  };
  onSuccess?: () => void;
}

const blogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  category: z.array(z.string()).nonempty("Minimal 1 kategori"),
  image: z.any(),
});

const Editor = dynamic(
  () => import("../../../blocks/editor-00/editor").then((m) => m.Editor),
  {
    ssr: false,
  },
);

type FormValues = z.infer<typeof blogSchema>;

export default function EditBlogForm({ blog, onSuccess }: UpdateBlogFormProps) {
  const updateBlog = useUpdateBlog();
  const [file, setFile] = useState<File | null>(null);

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
      let image: { url: string; path: string } | undefined | null = undefined;

      if (file) {
        // upload file baru ke Supabase Storage
        const supabase = createClient();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `blogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        image = { url: data.publicUrl, path: filePath };
      } else if (values.image === null) {
        // kalau user clear gambar
        image = null;
      }

      // 🔹 Panggil mutation update
      updateBlog.mutate(
        {
          id: blog.id,
          blog: {
            title: values.title,
            content: values.content,
            category: values.category,
            image,
          },
        },
        {
          onSuccess: () => {
            toast.success("Blog berhasil diupdate!");
          },
          onError: (err: any) => {
            toast.error(err.message || "Gagal mengupdate blog");
          },
        },
      );
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container space-y-6 max-w-full mx-auto h-full"
      >
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row items-start justify-center gap-4">
            <div className="grid gap-6 w-full md:w-fit md:flex-1">
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

        <div className="md:fixed w-full bottom-10 md:w-1/4">
          <Button
            type="submit"
            disabled={updateBlog.isPending}
            className="w-full"
          >
            {updateBlog.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
