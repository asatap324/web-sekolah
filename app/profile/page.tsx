import { FlickeringGrid } from "@/components/shared";
import {
  SchoolDataTable,
  TujuanSekolahCard,
  VisiMisiCard,
} from "@/components/profiles";
import MyImage from "@/components/ui/image";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Selamat datang di SMP Negeri 04 Muncar Satu Atap, sekolah berkualitas di Banyuwangi yang berkomitmen memberikan pendidikan terbaik.",
  keywords: [
    "tentang smp negeri 4 muncar",
    "sejarah sekolah",
    "visi misi",
    "profil sekolah",
  ],

  openGraph: {
    title: "Tentang Kami",
    description:
      "Kenali lebih dekat SMP Negeri 04 Muncar Satu Atap, sejarah, visi misi, dan program unggulan kami.",
    url: "https://smpn4muncarsatuatap.sch.id/profile",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-profile.png",
        width: 1200,
        height: 630,
        alt: "Tentang SMP Negeri 04 Muncar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami",
    description:
      "Kenali lebih dekat SMP Negeri 04 Muncar Satu Atap, sejarah, visi misi, dan program unggulan kami.",
    images: [
      {
        url: "https://smpn4muncarsatuatap.sch.id/og-image-profile.png",
        width: 1200,
        height: 630,
        alt: "Tentang Kami SMP Negeri 04 Muncar Satu Atap",
      },
    ],
  },
  alternates: {
    canonical: "https://smpn4muncarsatuatap.sch.i/profile",
  },
};

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-sidebar relative mt-16 sm:mt-28">
        <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>
        {/* Header */}
        <div className="p-6 border-b border-border flex flex-col gap-6 min-h-[250px] justify-center relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter max-w-4xl mb-2">
              Tentang Kami
            </h1>
            <p className="text-muted-foreground max-w-5xl text-sm md:text-base lg:text-lg text-pretty">
              Dengan visi untuk melahirkan generasi unggul yang tidak hanya
              cerdas secara akademis tetapi juga memiliki kreativitas, empati,
              dan ketrampilan hidup, misi kami adalah memberikan pendidikan
              menyeluruh yang mempersiapkan siswa menghadapi dinamika masa
              depan.
            </p>
          </div>
        </div>
        <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 pb-8 md:px-0 z-10">
          {/* Border kiri & kanan sepanjang layar */}
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2  max-w-7xl border-x border-border" />
          <div className="w-full overflow-y-scroll z-10 p-6">
            <MyImage
              src="/assets/logo-smp.png"
              alt="logo smp negeri 04"
              width={400}
              height={400}
              className="mx-auto"
            />
            <div className="prose dark:prose-invert max-w-none prose-p:tracking-tight prose-p:text-balance prose-lg mt-3.5 text-center">
              <p>
                SMP Negeri 4 Muncar Satu Atap sebagai satuan pendidikan berdiri
                sejak tahun 2006 di Desa Wringinputih yang dulunya masih satu
                lokasi dengan SD 5 Wringinputih. Pada awalnya adalah SMP dengan
                tiga ruang yang di bangun di lokasi yang sama dengan SD dengan
                mengkaryakan guru guru SD untuk menjadi guru di tingkat SMP.
              </p>
              <p>
                Tujuan didirikanya SMPN 04 Muncar Satu Atap ini adalah di
                harapkan anak anak lebih termotivasi untuk melanjutkan studi,
                tidak menambah beban keuangan keluarga dan dapat mensukseskan
                program wajib belajar sembilan tahun dan yang paling tepat
                adalah bermanfaat bagi kehidupannya.{" "}
              </p>
            </div>
            <div className="max-w-7xl mx-auto py-6 md:px-4">
              <SchoolDataTable />
            </div>
            <div className="py-6 md:px-4">
              <VisiMisiCard />
            </div>
            <div className="py-6 md:px-4">
              <TujuanSekolahCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
