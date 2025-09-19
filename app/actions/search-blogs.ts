// app/actions/searchBlogs.ts
"use server";

import { createServer } from "@/utils/supabase/server";

export async function searchBlogs(query: string) {
  const supabase = await createServer();

  if (!query || query.trim() === "") return [];

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug")
    .ilike("title", `%${query}%`)
    .limit(5);

  if (error) throw error;
  return data ?? [];
}
