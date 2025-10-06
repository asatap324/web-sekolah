"use server";
import { createServer } from "@/utils/supabase/server";

export async function resendVerificationAction(email: string) {
  try {
    const supabase = await createServer();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: "Gagal mengirim ulang email verifikasi",
      };
    }

    return {
      success: true,
      message: "Link verifikasi telah dikirim ulang ke email Anda!",
    };
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan sistem",
    };
  }
}
