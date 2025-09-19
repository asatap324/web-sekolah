import EditBlog from "@/components/dashboard-ui/blog-form-ui/edit-blog-ui/edit-blog";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <EditBlog blogId={id} />
    </div>
  );
}
