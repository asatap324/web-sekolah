"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditBlogForm from "./form-edit-blog"; // kamu sudah punya ini

export default function EditBlog({ blogId }: { blogId: string }) {
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (data) setBlog(data);
      setLoading(false);
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p className="text-red-500">Blog not found</p>;

  return <EditBlogForm blog={blog} />;
}
