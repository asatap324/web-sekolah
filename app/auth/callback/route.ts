// app/auth/callback/route.ts
import { createServer } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = await createServer();

      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("❌ Exchange error:", error.message);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verification-error`,
        );
      }

      // Get user and update profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            email_verified: true,
            verified_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Profile update error");
        } else {
          console.log("Profile updated successfully");
        }
      }

      // ✅ REDIRECT KE VERIFICATION SUCCESS
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verification-success`,
      );
    }

    // Jika tidak ada code, redirect ke error
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verification-error`,
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verification-error`,
    );
  }
}
