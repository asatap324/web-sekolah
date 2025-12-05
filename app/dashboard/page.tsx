import { DataTable } from "@/components/layout/sidebar/dashboard/shared";
// import MainDashboard from "@/components/dashboard-ui/main-dashboard";
import { getBlogs } from "@/lib/blogs";

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={blogs} />
          </div>
        </div>
      </div>
    </>
  );
}
