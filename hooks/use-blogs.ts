"use client";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

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

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title: blog.title,
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
      image?: { url: string; path: string };
    },
  ) => {
    // ambil blog lama dulu
    const { data: oldBlog, error: oldError } = await supabase
      .from("blogs")
      .select("image_path, image_url")
      .eq("id", id)
      .single();

    if (oldError) throw oldError;

    // kalau ada image baru & ada image lama → hapus lama
    if (
      blog.image?.path &&
      oldBlog?.image_path &&
      blog.image.path !== oldBlog.image_path
    ) {
      const { error: removeError } = await supabase.storage
        .from("blog-images")
        .remove([oldBlog.image_path]);

      if (removeError) {
        throw removeError; // bisa diganti return supaya nggak stop
      }
    }

    // update blog dengan image baru / lama
    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        image_url: blog.image?.url || oldBlog?.image_url,
        image_path: blog.image?.path || oldBlog?.image_path,
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
