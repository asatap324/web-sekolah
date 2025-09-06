import { createClient } from "@/utils/supabase/client";
import EditBlogForm from "@/components/dashboard-ui/create-blog-ui/edit-blog";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", params.id)
    .single();

  console.log(blog);

  if (error || !blog) {
    return <p className="p-4 text-red-500">Blog not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <EditBlogForm blog={blog} />
    </div>
  );
}
