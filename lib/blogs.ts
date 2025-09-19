import "server-only";
import { createServer } from "@/utils/supabase/server";

//
// ✅ Ambil semua blogs (tanpa pagination)
//
export async function getBlogs() {
  const supabase = await createServer();

  let query = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

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
