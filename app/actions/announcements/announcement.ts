"use server";

import { createServer } from "@/utils/supabase/server";

// ✅ PERBAIKI TYPE DEFINITION
export type Announcement = {
  id: string;
  title: string;
  content: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  content_type: string;
  type: string;
  priority: number;
  created_at: string;
};

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createServer();

    const now = new Date().toISOString();

    // console.log("🔍 Fetching active announcements...");

    const { data: announcements, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .lte("start_date", now)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      return [];
    }

    // console.log("✅ Announcements fetched:", announcements?.length || 0);
    return announcements || [];
  } catch (error) {
    console.error("❌ Unexpected error in getActiveAnnouncements:", error);
    return [];
  }
}

// ... rest of your code
