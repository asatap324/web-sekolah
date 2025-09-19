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

  // 🔹 cek role dari profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/"); // langsung redirect tanpa render dashboard
  }

  return (
    <>
      <MainDashboard blogs={blogs} />
    </>
  );
}
