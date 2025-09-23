import EditBlog from "@/components/dashboard-ui/blog-form-ui/edit-blog-ui/edit-blog";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="p-6">
      <EditBlog id={id} />
    </div>
  );
}
