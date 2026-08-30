import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY, GLOBAL_OPTIONS } from "./config";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY, GLOBAL_OPTIONS);
}
