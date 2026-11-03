import {
  BlogSection,
  FaqsSection,
  HeroSection,
  SambutanSection,
} from "@/components/sections";
import { Metadata } from "next";

import { getBlogs, getGuru } from "@/lib/content";

import { HomepageStructuredData } from "@/components/homepage-structured-data";
import { OptimizedYouTube, TemplateCarousel } from "@/components/shared";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { SectionWrapper } from "@/components/ui/section-wrapper";

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
  const [dataGuru, dataBlog] = await Promise.all([getGuru(7), getBlogs(9)]);

  return (
    <>
      <HomepageStructuredData />
      <div className="relative z-10">
        <div className="space-y-4 relative z-10 mt-12 sm:mt-28">
          <HeroSection />
        </div>
        <div className="flex divide-x divide-border relative max-w-full mx-auto px-4 pb-8 md:px-0 z-10">
          <FullWidthDivider />
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2  max-w-7xl border-x border-border" />
          <div className="w-full z-10">
            <SectionWrapper
              ornaments={[
                {
                  preset: "slide-left",
                  positionClasses: "top-1/4 -right-46 -rotate-30",
                  imageClasses: "w-[400px] h-[400px]",
                },
              ]}
            >
              <BlogSection blogs={dataBlog} />
            </SectionWrapper>

            <SectionWrapper
              ornaments={[
                {
                  preset: "slide-left",
                  positionClasses: "top-10 -right-30 rotate-12",
                },
                {
                  preset: "slide-right",
                  positionClasses: "top-10 -left-30 -rotate-12",
                  imageClasses: "w-72 h-72 -scale-x-100",
                },
              ]}
            >
              <SambutanSection />
            </SectionWrapper>

            <SectionWrapper>
              <div className="px-0 video-section max-w-7xl mx-auto mt-5">
                <div className="w-full h-full p-3">
                  <OptimizedYouTube
                    id="5HpHIbxkAV4"
                    title="Video Profile Sekolah"
                  />
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper
              className="guru-carousel"
              ornaments={[
                {
                  preset: "slide-right",
                  positionClasses: "top-1/4 -left-16 rotate-20",
                  imageClasses: "w-72 h-72 -scale-x-100",
                },
              ]}
            >
              <TemplateCarousel nameSection="Daftar Guru" items={dataGuru} />
            </SectionWrapper>

            <SectionWrapper
              className="ekstrakulikuler-section"
              ornaments={[
                {
                  preset: "slide-right",
                  positionClasses: "top-1/6 -right-10 rotate-180",
                  imageClasses: "w-80 h-80",
                },
              ]}
            >
              <TemplateCarousel
                nameSection="Ekstrakulikuler"
                items={ekstrakulikuler}
                isStaticImage={true}
              />
            </SectionWrapper>

            <SectionWrapper
              ornaments={[
                {
                  preset: "slide-right",
                  positionClasses: "top-1/4 -left-20 -rotate-30",
                  imageClasses: "w-[400px] h-[400px]",
                },
              ]}
            >
              <FaqsSection />
            </SectionWrapper>
          </div>
        </div>
      </div>
    </>
  );
}
