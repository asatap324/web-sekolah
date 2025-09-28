import { MetadataRoute } from "next";
import { createServer } from "@/utils/supabase/server"; // sesuaikan path utils

export default async function sitemapBlogs(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://smpn4muncarsatuatap.sch.id";
  const supabase = await createServer();

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("slug, updated_at");

  if (error) {
    console.error("Error fetching blogs for sitemap:", error.message);
  }

  return (
    blogs?.map((blog) => ({
      url: `${baseUrl}/article/${blog.slug}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? []
  );
}
