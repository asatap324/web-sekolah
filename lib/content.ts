import { createServer } from "@/utils/supabase/server";
import "server-only";

//
//  Ambil semua blogs (tanpa pagination)
//
export async function getBlogs(
  limit?: number,
  includeArchived: boolean = false,
) {
  const supabase = await createServer();

  let query = supabase
    .from("blogs")
    .select(
      "id, slug, title, image_url, category, content, created_at, is_archived",
    )
    .order("created_at", { ascending: false });

  if (!includeArchived) {
    query = query.eq("is_archived", false);
  }

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

export async function getRedaksiImageCount() {
  const supabase = await createServer();
  const { data, error } = await supabase.storage
    .from("blog-images")
    .list("redaksi", {
      limit: 1000,
    });

  if (error) {
    console.error("Error fetching redaksi images count:", error);
    return 0;
  }

  // Exclude empty folder placeholder if any (biasanya placeholder berupa .emptyFolderPlaceholder)
  return data
    ? data.filter((file) => file.name !== ".emptyFolderPlaceholder").length
    : 0;
}
