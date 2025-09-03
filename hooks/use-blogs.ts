"use client";

import { createClient } from "@/lib/supabase";

const supabase = createClient();

// 🔹 Upload image ke Supabase Storage
export async function uploadBlogImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `blogs/${fileName}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file);

  if (error) throw error;

  // Ambil public URL
  const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

  return data.publicUrl;
}

// 🔹 Hook untuk CRUD blogs
export function useBlogs() {
  const createBlog = async (blog: {
    title: string;
    content: string;
    category: string;
    image?: File; // ⬅️ tambahin support file
  }) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Harus login untuk membuat blog");
    }

    let imageUrl: string | null = null;

    if (blog.image) {
      imageUrl = await uploadBlogImage(blog.image);
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title: blog.title,
          content: blog.content,
          category: blog.category,
          author_id: user.id,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateBlog = async (
    id: string,
    blog: { title: string; content: string; category: string; image?: File },
  ) => {
    let imageUrl: string | null = null;

    if (blog.image) {
      imageUrl = await uploadBlogImage(blog.image);
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        ...(imageUrl && { image_url: imageUrl }),
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
