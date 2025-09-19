import CreateBlogForm from "@/components/dashboard-ui/blog-form-ui/create-blog-ui/form-create-blog";

export default function CreateBlogPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Buat Blog Baru</h1>
      <CreateBlogForm />
    </div>
  );
}
