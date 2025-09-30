import "server-only";
import { createServer } from "@/utils/supabase/server";

//
// ✅ Ambil semua blogs (tanpa pagination)
//
export async function getBlogs(limit?: number) {
  const supabase = await createServer();

  let query = supabase
    .from("blogs")
    .select("id, slug, title, image_url, category, content, created_at")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function getGuru(limit?: number) {
  const supabase = await createServer();

  let query = supabase
    .from("guru")
    .select("id, nama, role, image_url")
    .order("id", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

// export async function getLatestAnnouncement() {
//   const supabase = await createServer();

//   const { data, error } = await supabase
//     .from("announcements")
//     .select("*")
//     .eq("active", true)
//     .lte("start_date", new Date().toISOString())
//     .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)

//     console.error("Error fetching announcement:", error.message);
//     return null;
//   }

//   return data;
// }

//
// ✅ Ambil blogs dengan pagination
//
// export async function getBlogsPaginated(page: number = 1, limit: number = 6) {
//   const supabase = await createServer();

//   const from = (page - 1) * limit;
//   const to = from + limit - 1;

//   let query = supabase
//     .from("blogs")
//     .select("*", { count: "exact" }) // count untuk totalPages
//     .order("created_at", { ascending: false })
//     .range(from, to);

//   const { data, error, count } = await query;

//   if (error) throw error;

//   return {
//     data: data ?? [],
//     totalPages: count ? Math.ceil(count / limit) : 1,
//   };
// }
