import MainDashboard from "@/components/dashboard/main-dashboard";
import { getBlogs, getRedaksiImageCount } from "@/lib/content";

export default async function Page() {
  const blogs = await getBlogs(undefined, true);
  const redaksiCount = await getRedaksiImageCount();

  return (
    <>
      <MainDashboard blogs={blogs} redaksiCount={redaksiCount} />
    </>
  );
}
