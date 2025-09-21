import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PropsTujuan {
  id: number;
  value: string;
}

const dataMisi: PropsTujuan[] = [
  {
    id: 1,
    value:
      "85% lulusan diterima di SMA / SMK / MA Negeri atau sekolah yang di inginkan",
  },
  {
    id: 2,
    value:
      "Mewujudkan siswa berprestasi dibidang Akademik dan Non Akademik tingkat kabupaten.",
  },
  {
    id: 3,
    value:
      "Bakat dan minat siswa dapat disalurkan secara terarah melalui kegiatan Ekstrakulikuler Pramuka, Bola Volly, Sepak bola, Pencak Silat, Tari dan UKS/PMR.",
  },
  {
    id: 4,
    value:
      "Terlaksananya kegiatan pembelajaran yang berorientasi pada pendekatan CTL (Cotextual Teaching and Learning).",
  },
  {
    id: 5,
    value:
      "Tercapainya standar tenaga pendidik dan tenaga kependidikan 85% sesuai SNP (Standar Nasional Pendidikan).",
  },
  {
    id: 6,
    value:
      "Memiliki fasilitas/sarana dan prasarana sekolah yang semakin mendekati tuntutan SNP (Standar Nasional Pendidikan). ",
  },
  {
    id: 7,
    value:
      "Terwujudnya kegiatan penilaian yang sesuai dengan SNP (Standar Nasional Pendidikan). ",
  },
  {
    id: 8,
    value:
      "Memiliki dan mengimplementasikan kurikulum sekolah, meliputi Pemetaan (SK, KD, Indikator), Pengembangan Silabus, dan RPP untuk kelas 9 untuk semua mata pelajaran dan ( K1, KD, IPK ) untuk kelas 7 dan 8.",
  },
  {
    id: 9,
    value:
      "Terwujudnya manajemen pembiayaan pendidikan yang transparan dan akuntabel.",
  },
  {
    id: 10,
    value: "Terwujudnya manajemen sekolah yang partisipatif dan akuntabel.",
  },
];

export default function TujuanSekolahCard() {
  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight">Tujuan Sekolah</h2>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none prose-lg ">
          <ol className="list-decimal list-outside">
            {dataMisi.map((item) => (
              <li key={item.id}>{item.value}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
