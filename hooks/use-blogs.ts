"use client";

import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/use-store";

const supabase = createClient();

function slugify(title: string): string {
  return title
    .toLowerCase()
    .split(" ")
    .slice(0, 6) // ambil 6 kata pertama
    .join(" ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// 🔹 Fetcher untuk SWR
const fetchBlogs = async (limit?: number) => {
  let query = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit); // ✅ kasih limit kalau ada
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// 🔹 Hook untuk CRUD + Fetch
export function useBlogs(limit?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    ["blogs", limit], // ✅ cache key ikut limit biar unik
    () => fetchBlogs(limit),
    {
      revalidateOnFocus: false, // ❌ jangan refetch tiap tab fokus
      revalidateOnReconnect: false, // ❌ jangan refetch tiap koneksi balik
      dedupingInterval: 10000,
    },
  );
  const { user } = useUserStore();

  const createBlog = async (blog: {
    title: string;
    content: string;
    category: string[];
    image?: { url: string; path: string };
  }) => {
    if (!user) {
      throw new Error("Harus login untuk membuat blog");
    }

    const slug = slugify(blog.title);

    const { error } = await supabase
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
      .single();

    if (error) throw error;

    // 🔹 Revalidate data setelah create
    mutate();
  };

  const updateBlog = async (
    id: string,
    blog: {
      title?: string;
      content?: string;
      category?: string[];
      image?: { url: string; path: string } | null;
    },
  ) => {
    const updates: any = {
      ...(blog.title && { title: blog.title, slug: slugify(blog.title) }),
      ...(blog.content && { content: blog.content }),
      ...(blog.category && { category: blog.category }),
    };

    if (blog.image) {
      updates.image_url = blog.image.url;
      updates.image_path = blog.image.path;
    } else if (blog.image === null) {
      updates.image_url = null;
      updates.image_path = null;
    }

    const { error } = await supabase.from("blogs").update(updates).eq("id", id);

    if (error) throw error;

    // 🔹 Revalidate data setelah update
    mutate();
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;

    // 🔹 Revalidate data setelah delete
    mutate();
  };

  return {
    blogs: data,
    isLoading,
    error,
    mutate,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
