"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/use-store";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .split(" ")
    .slice(0, 6)
    .join(" ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

interface BlogInput {
  title: string;
  content: string;
  category: string[];
  image?: { url: string; path: string };
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  return useMutation({
    mutationFn: async (blog: BlogInput) => {
      if (!user) throw new Error("Must login to create blog");

      const supabase = createClient();
      const slug = slugify(blog.title);

      const { data, error } = await supabase
        .from("blogs")
        .insert([
          {
            title: blog.title,
            slug,
            content: blog.content,
            category: blog.category,
            image_url: blog.image?.url ?? null,
            image_path: blog.image?.path ?? null,
            author_id: user.id,
          },
        ])
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message || "Failed to create blog");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      if (data?.id)
        queryClient.invalidateQueries({ queryKey: ["blogs", data.id] });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      blog: Partial<Omit<BlogInput, "image">> & {
        image?: { url: string; path: string } | null;
      };
    }) => {
      const { id, blog } = params;
      const supabase = createClient();

      const updates: Record<string, any> = {};
      if (blog.title) {
        updates.title = blog.title;
        updates.slug = slugify(blog.title);
      }
      if (blog.content) updates.content = blog.content;
      if (blog.category) updates.category = blog.category;

      if (blog.image) {
        updates.image_url = blog.image.url;
        updates.image_path = blog.image.path;
      } else if (blog.image === null) {
        updates.image_url = null;
        updates.image_path = null;
      }

      const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message || "Failed to update blog");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      if (data?.id)
        queryClient.invalidateQueries({ queryKey: ["blogs", data.id] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw new Error(error.message || "Failed to delete blog");
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.removeQueries({ queryKey: ["blogs", id] });
    },
  });
}
