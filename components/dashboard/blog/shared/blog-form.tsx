"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import UploadThumbnails from "@/components/dashboard/blog/file-upload";
import { useCreateBlog, useUpdateBlog } from "@/hooks/use-content";
import { createClient } from "@/utils/supabase/client";
import { CategoryInput } from "../input-tag";

const Editor = dynamic(
  () => import("../../../editor/editor").then((m) => m.Editor),
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

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    content: string;
    category: string[];
    image_url?: string | null;
    image_path?: string | null;
  };
  onSuccess?: () => void;
}

export function BlogForm({ mode, initialData, onSuccess }: BlogFormProps) {
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      category: initialData?.category ?? [],
      image: initialData?.image_url ?? "",
    },
  });

  const isPending =
    mode === "create" ? createBlog.isPending : updateBlog.isPending;

  const onSubmit = async (values: BlogFormValues) => {
    try {
      let image: { url: string; path: string } | undefined | null = undefined;

      if (file) {
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
      } else if (mode === "edit" && values.image === null) {
        // user cleared the image
        image = null;
      }

      if (mode === "create") {
        createBlog.mutate(
          {
            title: values.title,
            content: values.content,
            category: values.category,
            image: image || undefined,
          },
          {
            onSuccess: () => {
              form.reset();
              setFile(null);
              toast.success("Blog berhasil dibuat!");
              if (onSuccess) onSuccess();
              else router.push("/dashboard");
            },
            onError: (err: any) => {
              toast.error(err.message || "Gagal membuat blog");
            },
          },
        );
      } else {
        if (!initialData?.id) throw new Error("ID Blog tidak ditemukan");

        updateBlog.mutate(
          {
            id: initialData.id,
            input: {
              title: values.title,
              content: values.content,
              category: values.category,
              image: image,
            },
          },
          {
            onSuccess: () => {
              toast.success("Blog berhasil diupdate!");
              if (onSuccess) onSuccess();
            },
            onError: (err: any) => {
              toast.error(err.message || "Gagal mengupdate blog");
            },
          },
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
          {/* MAIN COLUMN (Konten & Judul) */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Judul Artikel..."
                      className="border-0 bg-transparent px-0 text-3xl md:text-4xl font-bold tracking-tight shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto"
                      {...field}
                    />
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
                  <FormControl>
                    <div className="w-full">
                      <Editor
                        initialMarkdown={field.value}
                        onMarkdownChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SIDEBAR COLUMN (Pengaturan & Publikasi) */}
          <div className="lg:col-span-1 sticky top-24 flex flex-col gap-6 min-w-0">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Thumbnail Cover
                      </FormLabel>
                      <FormControl>
                        <UploadThumbnails
                          onFileSelect={setFile}
                          initialUrl={initialData?.image_url || null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="h-px w-full bg-border" />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Kategori Topik
                      </FormLabel>
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

              {/* PUBLISH ACTION */}
              <div className="p-6 bg-muted/30 border-t border-border">
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    (mode === "edit" && !form.formState.isDirty && !file)
                  }
                  className="w-full font-semibold shadow-sm transition-all active:scale-[0.98]"
                  size="lg"
                >
                  {isPending
                    ? "⏳ Menyimpan..."
                    : mode === "create"
                      ? "Publikasikan Blog"
                      : "Simpan Perubahan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
