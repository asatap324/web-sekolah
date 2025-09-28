// app/sitemap.ts
import { MetadataRoute } from "next";
import { createServer } from "@/utils/supabase/server";

export const revalidate = 3600;

interface BlogPost {
  slug: string;
  created_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  const supabase = await createServer();

  try {
    // Fetch blogs published
    const { data: blogs, error: blogsError } = await supabase
      .from("blogs")
      .select("slug, created_at")
      .order("created_at", { ascending: false });

    if (blogsError) throw blogsError;
    // Static pages
    const staticPages = getStaticPages(baseUrl);

    // Blog pages
    const blogPages =
      blogs?.map((blog: BlogPost) => ({
        url: `${baseUrl}/article/${blog.slug}`,
        lastModified: new Date(blog.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback ke basic sitemap jika error
    return getStaticPages(baseUrl);
  }
}

function getStaticPages(baseUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/daftar-guru`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
