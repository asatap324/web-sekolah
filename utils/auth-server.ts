import { createServer } from "@/utils/supabase/server";

export async function getServerUser() {
  try {
    const supabase = await createServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      // console.error("Auth error:", authError);
      return null;
    }

    if (!user) return null;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, role, createdAt, emailVerified, emailVerifiedAt")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      // console.warn("Profile not found:", profileError);
      // Return basic user data even if profile doesn't exist
      return {
        id: user.id,
        email: user.email ?? "",
        username: null,
        role: null,
        createdAt: user.created_at ?? "",
        emailVerified: false,
        emailVerifiedAt: null,
      };
    }

    return {
      id: user.id,
      email: user.email ?? "",
      username: profile?.username ?? null,
      role: profile?.role ?? null,
      createdAt: user.created_at ?? "",
      emailVerified: profile?.createdAt ?? false,
      emailVerifiedAt: profile?.emailVerifiedAt ?? null,
    };
  } catch (error) {
    // console.error("Error in getServerUser:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
