"use server";

import { createServer } from "@/utils/supabase/server";

import { registerSchema } from "@/types/form-schema";
import { revalidatePath } from "next/cache";

// bentuk state
type SignupState = {
  error: string | null;
  success?: boolean | null;
  redirectTo?: string | undefined;
  message?: string;
};

export async function signupAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  // console.log("🚀 Starting signup action...");
  const supabase = await createServer();

  const parsed = registerSchema.safeParse({
    email: String(formData.get("email")).trim().toLowerCase(),
    password: String(formData.get("password")),
    username: String(formData.get("username")).trim(),
  });

  if (!parsed.success) {
    console.error("❌ Schema validation failed:", parsed.error);
    return {
      error:
        "Input tidak valid: " +
        parsed.error.issues.map((issue) => issue.message).join(", "),
      success: false,
      redirectTo: undefined,
    };
  }

  const { email, password, username } = parsed.data;
  // console.log(`📝 Signup attempt for: ${email} (${username})`);

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return {
      error: "Username sudah digunakan",
      success: false,
      redirectTo: undefined,
    };
  }

  // console.log("🔐 Attempting Supabase auth signup...");

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (authError) {
    return {
      error: getSignupErrorMessage(authError),
      success: false,
      redirectTo: undefined,
    };
  }

  // console.log("✅ Auth user created:", authData.user?.id);

  if (authData.user) {
    // console.log("📊 Creating profile...");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      username: username,
      email_user: email, // Store email in profile too
      role: "user", // Default role
      email_verified: false,
    });

    if (profileError) {
      // console.error("❌ Profile creation error:", profileError);
      // Rollback: delete auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error("Terjadi kesalahan. Silakan coba lagi.");
      }

      return {
        error: "Gagal membuat profil pengguna" + profileError.message,
        success: false,
        redirectTo: undefined,
      };
    }
    // console.log("✅ Profile created successfully");
  }

  revalidatePath("/auth/login");
  revalidatePath("/");

  // console.log("🎉 Signup completed successfully!");

  return {
    error: null,
    success: true,
    message: "Link verifikasi telah dikirim ke email Anda!",
  };
}

// Enhanced error messages for signup
function getSignupErrorMessage(error: any): string {
  const message = error.message.toLowerCase();

  // console.log("Terjadi kesalahan saat pendaftaran:", message);

  if (message.includes("email") && message.includes("already")) {
    return "Email sudah terdaftar";
  }
  if (message.includes("password") && message.includes("weak")) {
    return "Password terlalu lemah, minimal 6 karakter";
  }
  if (message.includes("invalid email")) {
    return "Format email tidak valid";
  }
  if (message.includes("rate limit")) {
    return "Terlalu banyak percobaan, silakan coba lagi nanti";
  }

  return `Terjadi kesalahan saat pendaftaran: ${message}`;
}
