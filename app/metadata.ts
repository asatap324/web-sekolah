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
];

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: metadataKeywords,
  authors: [
    {
      name: "Admin SMP Negeri 04 Muncar Satu Atap",
      url: "https://smpn4muncarsatuatap.sch.id/",
    },
  ],
  creator: "SMP Negeri 04 Muncar Satu Atap",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "",
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
};
