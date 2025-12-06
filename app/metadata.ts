import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
  "SMP Negeri 4 Muncar",
  "sekolah banyuwangi",
  "pendidikan berkualitas",
  "SMP satu atap",
  "daftar sekolah menengah",
  "sekolah negeri banyuwangi",
  "pendidikan terbaik",
  "smpn4muncarsatuatap",
  "SMP Negeri 04 Muncar",
  "sekolah unggulan Banyuwangi",
  "pendidikan menengah pertama",
];

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: metadataKeywords,
  authors: [
    {
      name: "Admin SMP Negeri 04 Muncar Satu Atap",
      url: "https://smpn4muncarsatuatap.sch.id/",
    },
  ],
  creator: "Rafi Ahsira Prayoga",
  publisher: "SMP Negeri 04 Muncar Satu Atap",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`, // atau `${siteConfig.url}/og-image.jpg`
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`, // atau `${siteConfig.url}/og-image.jpg`
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
  other: {
    "geo.region": "ID-JI",
    "geo.placename": "Banyuwangi, Jawa Timur",
  },
};
