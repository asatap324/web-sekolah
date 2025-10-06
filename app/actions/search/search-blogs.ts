// app/actions/search-blogs.ts
"use server";
import { createServer } from "@/utils/supabase/server";

export async function searchBlogs(
  query: string,
  opts?: { signal?: AbortSignal },
) {
  try {
    const supabase = await createServer();

    if (!query || query.trim() === "") return [];

    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug")
      .ilike("title", `%${query}%`)
      .limit(5);

    if (error) {
      // Log untuk monitoring tanpa expose detail ke client
      console.error("Search blogs database error:", error.message);
      return []; // Return empty array instead of throwing
    }

    return data ?? [];
  } catch (error: any) {
    // Handle abort errors dan lainnya
    if (error.name === "AbortError") {
      throw error; // Biarkan abort error pass through
    }

    // Untuk error lainnya, return empty array untuk UX yang better
    console.error("Search blogs unexpected error:", error.message);
    return [];
  }
}
