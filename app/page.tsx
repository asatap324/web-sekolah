import { Metadata } from "next";
import {
  HeroSection,
  SambutanSection,
  BlogSection,
  FaqsSection,
} from "@/components/sections";

import { Spinner } from "@/components/ui/spinner";
import { getBlogs, getGuru } from "@/lib/blogs";

import { Suspense } from "react";
import { TemplateCarousel } from "@/components/shared";
import { HomepageStructuredData } from "@/components/homepage-structured-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default:
      "SMP Negeri 04 Muncar Satu Atap - Sekolah Berkualitas di Banyuwangi",
    template: "%s | SMP Negeri 04 Muncar", // untuk halaman lain
  },
  description:
    "SMP Negeri 04 Muncar Satu Atap menyediakan pendidikan menengah pertama terbaik di Banyuwangi dengan fasilitas lengkap dan pengajar profesional.",
  keywords: [
    "SMP Negeri 4 Muncar",
    "sekolah terbaik Banyuwangi",
    "pendidikan berkualitas",
    "SMP satu atap Banyuwangi",
    "daftar SMP Negeri",
  ],

  openGraph: {
    title: "SMP Negeri 04 Muncar Satu Atap - Sekolah Berkualitas",
    description:
      "Sekolah menengah pertama terbaik di Banyuwangi dengan pendidikan berkualitas",
    url: "https://smpn4muncarsatuatap.sch.id/",
    siteName: "SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image.png", // Gambar khusus untuk homepage
        width: 1200,
        height: 630,
        alt: "SMP Negeri 04 Muncar Satu Atap",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SMP Negeri 04 Muncar Satu Atap",
    description: "Sekolah menengah pertama terbaik di Banyuwangi",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image.png",
        width: 1200,
        height: 630,
        alt: "SMP Negeri 04 Muncar Satu Atap",
      },
    ],
  },

  alternates: {
    canonical: "https://smpn4muncarsatuatap.sch.id/",
  },
};

const ekstrakulikuler = [
  {
    id: "1",
    nama: "PMR",
    image_url: "/assets/PMR.webp",
  },
  {
    id: "2",
    nama: "Qiroah",
    image_url: "/assets/Qiroah.webp",
  },
  {
    id: "3",
    nama: "Sepak Bola",
    image_url: "/assets/sepakbola.webp",
  },
  {
    id: "4",
    nama: "Pencak Silat",
    image_url: "/assets/silat.webp",
  },
  {
    id: "6",
    nama: "Taekwondo",
    image_url: "/assets/Taekwondo.webp",
  },
  {
    id: "7",
    nama: "Tari",
    image_url: "/assets/Tari.webp",
  },
  {
    id: "8",
    nama: "Volleyball",
    image_url: "/assets/Volly.webp",
  },
];

export default async function Home() {
  const dataGuru = await getGuru(7);
  const dataBlog = await getBlogs(9);

  return (
    <>
      <HomepageStructuredData />
      <div className="relative z-10">
        <div className="space-y-4 border-b border-border relative z-10 mt-12 sm:mt-28">
          <HeroSection />
        </div>
        <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-10">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2  max-w-7xl border-x border-border" />
          <div className="w-full overflow-y-scroll z-10">
            <Suspense
              fallback={
                <div className="flex justify-center items-center min-h-[300px]">
                  <Spinner />
                  <span className="ml-2 text-foreground">Memuat blog...</span>
                </div>
              }
            >
              <BlogSection blogs={dataBlog} />
            </Suspense>
            <SambutanSection />
            <div className="max-w-7xl mx-auto py-6 md:px-5">
              <TemplateCarousel nameSection="Daftar Guru" items={dataGuru} />
            </div>
            <div className="max-w-7xl mx-auto py-6 md:px-5">
              <TemplateCarousel
                nameSection="Ekstrakulikuler"
                items={ekstrakulikuler}
              />
            </div>
            <div className="w-full md:px-5 -mt-6">
              <FaqsSection />
            </div>
            {/*<div className="w-full md:px-5 -mt-6">
              <CallToAction />
            </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}
