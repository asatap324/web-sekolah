import EditBlog from "@/components/dashboard-ui/blog-form-ui/edit-blog-ui/edit-blog";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-6">
      <EditBlog id={id} />
    </div>
  );
}
