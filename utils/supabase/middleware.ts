import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isRouteMatch, routeConfig } from "@/lib/route-config";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase environment variables");
    return supabaseResponse;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { pathname } = request.nextUrl;

  const isPublic = isRouteMatch(pathname, routeConfig.public);
  const isAdmin = isRouteMatch(pathname, routeConfig.admin);
  const isAuth = isRouteMatch(pathname, routeConfig.auth);

  // Skip auth check untuk public routes
  if (isPublic && !isAdmin && !isAuth) {
    return supabaseResponse;
  }

  // Hanya panggil getUser() jika benar-benar dibutuhkan
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
