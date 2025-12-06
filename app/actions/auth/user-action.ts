// app/actions/user-actions.ts
"use server";

import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";

export async function updateUserProfile(formData: FormData) {
  const supabase = await createServer();

  // 1. Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  // const fullName = formData.get("full_name") as string;

  try {
    // 2. Update profile table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: "Gagal mengupdate profile" };
    }

    // 3. Update auth metadata (optional)
    if (username) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          username: username,
          // full_name: fullName,
        },
      });

      if (authError) {
        console.error("Auth update error:", authError);
        // Continue anyway, karena profile table sudah terupdate
      }
    }

    revalidatePath("/profile");
    return { success: "Profile berhasil diupdate" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}

// export async function updateEmailAction(formData: FormData) {
//   const supabase = await createServer();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { error: "Unauthorized" };

//   const newEmail = formData.get("email") as string;

//   // 1. Update email di Auth
//   const { error: emailError } = await supabase.auth.updateUser({
//     email: newEmail,
//   });

//   if (emailError) {
//     return { error: emailError.message };
//   }

//   // 2. Update email di profiles table (optional)
//   const { error: profileError } = await supabase
//     .from("profiles")
//     .update({
//       email: newEmail,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", user.id);

//   if (profileError) {
//     console.error("Failed to update profile email:", profileError);
//     // Continue anyway, karena auth sudah terupdate
//   }

//   return {
//     success: "Email berhasil diupdate. Silakan verifikasi email baru Anda.",
//     requiresVerification: true,
//   };
// }
//
//

export async function hardDeleteAccount() {
  try {
    // console.log(" Starting hard delete process...");

    // 1. Buat client untuk get current user (gunakan anon key)
    const supabaseAnon = await createServer();

    // 2. Get current user
    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser();

    if (authError || !user) {
      // console.error("❌ Auth error:", authError);
      return {
        success: false,
        error: "Anda belum login",
      };
    }

    // console.log(`User ID: ${user.id}`);
    // console.log(`User Email: ${user.email}`);

    // 3. VALIDASI SERVICE ROLE KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      console.error("❌ SERVICE_ROLE_KEY is missing!");
      return {
        success: false,
        error: "Server configuration error. Contact administrator.",
      };
    }

    // console.log("Service Role Key found, length:", serviceRoleKey.length);

    // 4. Buat ADMIN CLIENT dengan SERVICE ROLE KEY
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // console.log("Deleting user from auth...");

    // 5. HAPUS USER dengan admin client
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id,
      // Parameter kedua (cascade) default true di Supabase v2
    );

    if (deleteError) {
      console.error("❌ Delete error details:", {
        message: deleteError.message,
        code: deleteError.code,
        status: deleteError.status,
      });

      // Coba alternatif: Delete via direct API call
      // console.log("Trying alternative method...");
      return;
    }

    // console.log("Auth user deleted successfully");

    // 6. Sign out
    await supabaseAnon.auth.signOut();

    return {
      success: true,
      message: "Akun berhasil dihapus permanen",
    };
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan sistem",
    };
  }
}
