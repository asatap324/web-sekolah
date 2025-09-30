// components/structured-data.tsx
interface ArticleStructuredDataProps {
  data: {
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    slug: string;
  };
}

export function ArticleStructuredData({ data }: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.content.slice(0, 160),
    image: data.image_url || "https://smpn4muncarsatuatap.sch.id/og-image.png",
    datePublished: data.created_at,
    dateModified: data.created_at,
    author: {
      "@type": "Organization",
      name: "SMP Negeri 04 Muncar Satu Atap",
      url: "https://smpn4muncarsatuatap.sch.id",
    },
    publisher: {
      "@type": "Organization",
      name: "SMP Negeri 04 Muncar Satu Atap",
      logo: {
        "@type": "ImageObject",
        url: "https://smpn4muncarsatuatap.sch.id/assets/logo-smp.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://smpn4muncarsatuatap.sch.id/article/${data.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
