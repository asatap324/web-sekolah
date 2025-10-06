// actions/login-action.ts
"use server";

import { createServer } from "@/utils/supabase/server";
import { loginSchema } from "@/types/form-schema";
import { revalidatePath } from "next/cache";
import { checkRateLimit, recordLoginAttempt } from "./rate-limit";

type OptimisticState = {
  isLoggingIn: boolean;
  remainingAttempts: number;
  error: string | null;
};

export async function loginAction(
  prevState: OptimisticState,
  formData: FormData,
): Promise<{
  success: boolean;
  error?: string;
  redirectTo?: string;
  remainingAttempts?: number;
}> {
  try {
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password")).trim();

    // Validasi input
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      return {
        success: false,
        error: "Email atau password tidak valid",
        remainingAttempts: prevState.remainingAttempts,
      };
    }

    // ✅ Cek rate limit (EMAIL-ONLY)
    const rateLimit = await checkRateLimit(email);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: rateLimit.message || "Terlalu banyak percobaan login",
        remainingAttempts: 0,
      };
    }

    const supabase = await createServer();

    // Attempt login
    const { error, data } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      // ✅ Record failed attempt (EMAIL-ONLY)
      await recordLoginAttempt(email, false);
      const updatedRateLimit = await checkRateLimit(email);

      return {
        success: false,
        error: getLoginErrorMessage(error),
        remainingAttempts: updatedRateLimit.remaining,
      };
    }

    // ✅ Record successful attempt (EMAIL-ONLY)
    await recordLoginAttempt(email, true);

    // Verify user dan get profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Autentikasi gagal, silakan coba lagi",
        remainingAttempts: 5, // Reset untuk system error
      };
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, email_verified")
      .eq("id", user.id)
      .maybeSingle();

    // Cek email verification
    if (!profile?.email_verified) {
      return {
        success: false,
        error:
          "Email belum terverifikasi. Silakan check email Anda untuk link verifikasi.",
        remainingAttempts: 5, // Reset karena bukan password error
      };
    }

    // Determine redirect based on role
    let redirectTo = "/";
    if (profile?.role === "admin") {
      redirectTo = "/dashboard";
    }

    // Revalidate cache
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      redirectTo,
      remainingAttempts: 5, // ✅ Reset ke 5 pada success
    };
  } catch (error) {
    // console.error("Login error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan sistem, silakan coba lagi",
      remainingAttempts: prevState.remainingAttempts,
    };
  }
}

// Error messages
function getLoginErrorMessage(error: any): string {
  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email atau password salah";
  }
  if (message.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Silakan check email Anda";
  }
  if (message.includes("user not found")) {
    return "Akun tidak ditemukan";
  }
  if (message.includes("network error") || message.includes("fetch")) {
    return "Koneksi internet bermasalah";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Terlalu banyak percobaan login, coba lagi nanti";
  }

  return "Terjadi kesalahan saat login";
}
