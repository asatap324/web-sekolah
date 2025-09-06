"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useBlogs } from "@/hooks/use-blogs";
import { useRouter } from "next/navigation";
import UploadThumnails from "./file-upload";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Content is required"),
  category: z.string().min(2, "Category is required"),
  image: z.any(),
});

type FormValues = z.infer<typeof schema>;

export default function EditBlogForm({ blog }: { blog: any }) {
  const router = useRouter();

  const { updateBlog } = useBlogs();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      category: blog?.category || "",
      image: blog.image_url
        ? {
            url: blog.image_url, // public URL
            path: blog.image_path, // internal path di bucket
          }
        : null,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateBlog(blog.id, {
        title: values.title,
        content: values.content,
        category: values.category,
        image: values.image, // { url, path }
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <UploadThumnails
                value={form.watch("image")}
                onChange={(val) => form.setValue("image", val)}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <Input {...field} />
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
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Blog</Button>
      </form>
    </Form>
  );
}
