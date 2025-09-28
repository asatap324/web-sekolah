import { FlickeringGrid } from "@/components/blocks/flickering-grid";
import SchoolDataTable from "@/components/blocks/profile-sekolah/school-data-table";
import TujuanSekolahCard from "@/components/blocks/profile-sekolah/tujuan-sekolah-card";
import VisiMisiCard from "@/components/blocks/profile-sekolah/visi-misi-card";
import MyImage from "@/components/ui/image";

import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile",
  description: "Latest news and updates from Our School.",
  openGraph: {
    title: "Profile",
    description: "Latest news and updates from Our School.",
    url: "https://smpn4muncarsatuatap.sch.id/profile",
    siteName: "SMP Negeri 04 Muncar Satu Atap",
    images: [
      {
        url: "https://example.com/og-article.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-background relative mt-16 sm:mt-28">
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
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
              Profile SMP Negeri 04 Muncar Satu Atap
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base lg:text-lg">
              Mewujudkan pengembangan bakat minat peserta didik sesuai dengan
              kemampuan dasarnya dalam bidang kegiatan ekstrakurikuler.
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
