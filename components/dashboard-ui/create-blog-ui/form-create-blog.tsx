"use client";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import UploadThumnails from "./file-upload";
import { useUser } from "@/hooks/use-user";

const blogSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  category: z.string().min(3, "Kategori minimal 3 karakter"),
  image: z.any(),
});

type BlogForm = z.infer<typeof blogSchema>;

export default function CreateBlogForm() {
  const { createBlog } = useBlogs();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      image: "",
    },
  });

  const onSubmit = async (values: BlogForm) => {
    try {
      if (!user) return alert("Harus login");
      setLoading(true);

      await createBlog({
        title: values.title,
        content: values.content,
        category: values.category,
        image: values.image, // { url, path }
      });
      form.reset();
      toast.success("Blog berhasil dibuat!");
    } catch (error: any) {
      toast.error(error.message || "❌ Gagal membuat blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <UploadThumnails value={field.value} onChange={field.onChange} />
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
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Agenda Sekolah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tulis konten blog kamu di sini..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Menyimpan..." : "Buat Blog"}
        </Button>
      </form>
    </Form>
  );
}
