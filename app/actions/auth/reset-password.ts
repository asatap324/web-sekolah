"use server";

import { createServer } from "@/utils/supabase/server";

type ResetPasswordState = {
  error: string | null;
  success: boolean;
  message?: string;
};

// 1. Request Reset Password Link
export async function requestResetPasswordAction(
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        error: "Email is required",
        success: false,
      };
    }

    const supabase = await createServer();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/confirm`,
    });

    if (error) {
      return {
        error: getErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
      message: "Reset password link has been sent to your email!",
    };
  } catch (error) {
    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
}

// 2. Update Password setelah klik link
export async function updatePasswordAction(
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  try {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      return {
        error: "Semua field harus diisi",
        success: false,
      };
    }

    if (password !== confirmPassword) {
      return {
        error: "Password tidak cocok",
        success: false,
      };
    }

    if (password.length < 8) {
      return {
        error: "Password must be at least 8 characters",
        success: false,
      };
    }

    const supabase = await createServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error:
          "Reset session tidak valid atau sudah kadaluarsa. Silakan request reset password lagi.",
        success: false,
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return {
        error: getErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
      message: "Password berhasil diupdate! Mengarahkan ke halaman login...",
    };
  } catch (error) {
    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
}

// Error messages helper
function getErrorMessage(error: any): string {
  const message = error.message.toLowerCase();

  if (message.includes("email not found")) {
    return "Email tidak ditemukan";
  }
  if (message.includes("rate limit")) {
    return "Terlalu banyak percobaan. Coba lagi nanti.";
  }
  if (message.includes("password")) {
    return "Password terlalu lemah";
  }
  if (message.includes("auth session missing")) {
    return "Link reset password tidak valid atau sudah kadaluarsa";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}
