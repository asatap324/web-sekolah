import MainDashboard from "@/components/dashboard-ui/main-dashboard";
import { createServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getBlogs } from "@/lib/blogs";

export default async function Page() {
  const blogs = await getBlogs();

  const supabase = await createServer();

  // 🔹 cek user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login"); // kalau belum login
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id) // biasanya pakai user.id atau user.uuid sesuai schema
    .maybeSingle();

  if (error) {
    console.error(error);
    redirect("/"); // fallback
  }

  // cek role
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <MainDashboard blogs={blogs} />
    </>
  );
}
