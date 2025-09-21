"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropsMisi {
  id: number;
  value: string;
}

const dataMisi: PropsMisi[] = [
  {
    id: 1,
    value: "Mewujudkan Implementasi Kurikulum Merdeka secara bertahap.",
  },
  {
    id: 2,
    value:
      "Mewujudkan Pembelajaran yang bertumpu pada kompetensi peserta didik.",
  },
  {
    id: 3,
    value:
      "Mewujudkan Proses Pembelajaran dengan pendekatan saintifik (5 M: mengamati, menanya, mengumpulkan informasi, mengasosiasi dan mengkomunikasikan ) dengan suplemen 4 C ( critical thinking, creative, colaborative, communicative ).",
  },
  {
    id: 4,
    value:
      "Mewujudkan Proses Pembelajaran dengan metode yang inovatif dan variatif.",
  },
  {
    id: 5,
    value:
      "Meningkatkan kemampuan Tenaga Pendidikan dan Kependidikan melalui Diklat, seminar atau kegiatan MGMP sekolah dan kabupaten.",
  },
  {
    id: 6,
    value:
      "Mewujudkan pengembangan bakat minat peserta didik sesuai dengan kemampuan dasarnya dalam bidang kegiatan ekstrakurikuler.",
  },
  {
    id: 7,
    value:
      "Mewujudkan Peningkatan internalisasi nilai nilai agama dalam kehidupan sehari hari melalui pembiasaan kegiatan keagamaan dilingkungan sekolah Meningkatkan pengetahuan dan pemahaman keagamaan bagi peserta didik.",
  },
];

export default function VisiMisiCard() {
  const [expanded, setExpanded] = useState({ visi: false, misi: false });
  return (
    <>
      <Card className="flex flex-col items-center gap-6 p-0 shadow-none">
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight">
            Visi & Misi Sekolah
          </h2>
        </CardHeader>

        <CardContent className="grid grid-cols-1  md:grid-cols-2 gap-6">
          <Card className="shadow-none">
            <CardHeader>Visi</CardHeader>
            <CardContent>
              <p
                className={`prose dark:prose-invert max-w-none prose-p:tracking-tight prose-p:text-balance prose-lg ${
                  expanded.visi ? "line-clamp-none" : "line-clamp-4"
                } md:line-clamp-none`}
              >
                Kurikulum Operasional Sekolah atau KOS disusun oleh Satuan
                Pendidikan untuk memungkinkan penyesuaian program pendidikan
                dengan kebutuhan dan potensi yang ada di sekolah. Sekolah
                sebagai unit penyelenggara pendidikan juga harus memperhatikan
                perkembangan dan tantangan masa depan diantaranya
                adalah:perkembangan ilmu pengetahuan dan teknologi, globalisasi
                yang memungkinkan sangat cepatnya arus perubahan dan mobilitas
                antar dan lintas sektor serta tempat, era informasi, pengaruh
                globalisasi terhadap perubahan perilaku dan moral manusia,
                berubahnya kesadaran masyarakat dan orang tua terhadap
                pendidikan, era perdagangan bebas.{" "}
              </p>
              <Button
                className="mt-3.5 md:hidden"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, visi: !prev.visi }))
                }
              >
                {expanded.visi ? "Sembunyikan" : "Lihat Selengkapnya"}
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>Misi</CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none prose-lg ">
              <ol
                className={`list-decimal list-outside ${
                  expanded.misi ? "line-clamp-none" : "line-clamp-6"
                } `}
              >
                {dataMisi.map((item) => (
                  <li key={item.id}>{item.value}</li>
                ))}
              </ol>
              <Button
                className="mt-3.5"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, misi: !prev.misi }))
                }
              >
                {expanded.misi ? "Sembunyikan" : "Lihat Selengkapnya"}
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
