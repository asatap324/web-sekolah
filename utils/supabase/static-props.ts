// utils/supabase/server-simple.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Untuk static generation & build time
export function createServerClientSimple() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // atau service role key
    {
      global: {
        headers: {
          "CDN-Cache-Control": "public, max-age=3600, s-maxage=7200",
        },
      },
    },
  );
  return supabase;
}
