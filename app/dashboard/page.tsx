import MainDashboard from "@/components/dashboard-ui/main-dashboard";
import { getBlogs } from "@/lib/blogs";

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <>
      <MainDashboard blogs={blogs} />
    </>
  );
}
