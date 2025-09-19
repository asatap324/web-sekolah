"use client";
import dynamic from "next/dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBlogs } from "@/hooks/use-blogs";

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
import { cn } from "@/lib/utils";
import { CheckCircle2, LoaderCircleIcon, X, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryInput } from "../input-tag";

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
  const { createBlog } = useBlogs();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setLoading(true);
      setSuccess(false);

      let image: { url: string; path: string } | undefined = undefined;

      if (file) {
        // upload ke Supabase baru pas submit
        const supabase = createClient();
        // const fileExt = file.name.split(".").pop();
        const fileName = `${file.name}`;
        const filePath = `blogs/${fileName}`;

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
      }

      await createBlog({
        title: values.title,
        content: values.content,
        category: values.category,
        image,
      });
      form.reset();
      setFile(null);
      setSuccess(true);
      toast.success("Blog berhasil dibuat!");
    } catch (error: any) {
      toast.error(error.message || "❌ Gagal membuat blog");
    } finally {
      setLoading(false);
      // reset success state biar tombol balik normal setelah beberapa detik
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
          <div className="flex items-start justify-center gap-4">
            <div className="grid gap-6 flex-1">
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
                <FormItem className="flex-1">
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
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
