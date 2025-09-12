"use client";

import { createClient } from "@/utils/supabase/client";

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

// 🔹 Hook untuk CRUD blogs
export function useBlogs() {
  const createBlog = async (blog: {
    title: string;
    content: string;
    category: string;
    image?: { url: string; path: string }; // ⬅️ tambahin support file
  }) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Harus login untuk membuat blog");
    }

    const slug = slugify(blog.title);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title: blog.title,
          slug,
          content: blog.content,
          category: blog.category,
          author_id: user.id,
          image_url: blog.image?.url || null,
          image_path: blog.image?.path || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateBlog = async (
    id: string,
    blog: {
      title: string;
      content: string;
      category: string;
      image?: { url: string; path: string } | null;
    },
  ) => {
    const supabase = createClient();

    // Ambil data blog lama dulu (supaya tau path file lama)
    const { data: oldBlog, error: fetchError } = await supabase
      .from("blogs")
      .select("image_path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Kalau ada gambar baru DAN ada gambar lama → hapus file lama
    if (
      blog.image?.path &&
      oldBlog?.image_path &&
      blog.image.path !== oldBlog.image_path
    ) {
      await supabase.storage.from("blog-images").remove([oldBlog.image_path]);
    }

    // Update blog di DB
    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        image_url: blog.image?.url || null,
        image_path: blog.image?.path || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) throw error;
    return true;
  };

  return { createBlog, updateBlog, getBlogs, deleteBlog };
}
