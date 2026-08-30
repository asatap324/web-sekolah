export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const GLOBAL_OPTIONS = {
  global: {
    headers: {
      "CDN-Cache-Control": "public, max-age=3600, s-maxage=7200",
    },
  },
};
