import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_KEY, GLOBAL_OPTIONS } from "./config";

export async function createServer() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    ...GLOBAL_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Abaikan error di Server Component
        }
      },
    },
  });
}

export function createStaticClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY, GLOBAL_OPTIONS);
}
