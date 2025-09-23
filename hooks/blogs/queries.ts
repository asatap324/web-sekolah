"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

/**
 * Fetch list blogs
 */
async function fetchBlogs(limit?: number) {
  const supabase = createClient();

  let query = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message || "Failed to fetch blogs");
  return data;
}

/**
 * Fetch single blog by id
 */
async function fetchBlogById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message || "Failed to fetch blog");
  return data;
}

export function useBlogsQuery(limit?: number) {
  return useQuery({
    queryKey: ["blogs", limit],
    queryFn: () => fetchBlogs(limit),
  });
}

export function useBlogQueryById(id: string) {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => fetchBlogById(id),
    enabled: !!id,
  });
}
