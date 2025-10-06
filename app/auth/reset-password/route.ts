import { createServer } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = "/auth/reset-password/confirm";

    if (code) {
      const supabase = await createServer();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Redirect ke halaman update password
        return NextResponse.redirect(new URL(next, request.url));
      }
    }

    // Redirect ke error page jika gagal
    return NextResponse.redirect(
      new URL("/auth/forgot-password?error=invalid_link", request.url),
    );
  } catch (error) {
    console.error("Reset password callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/forgot-password?error=unexpected", request.url),
    );
  }
}
