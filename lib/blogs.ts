import "server-only";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getBlogs = cache(async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
});

export async function getBlogById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
