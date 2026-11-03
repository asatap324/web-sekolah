"use client";
import { Button } from "@/components/ui/button";
import MyImage from "@/components/ui/image";
import { IconSchool } from "@tabler/icons-react";
import { useState } from "react";

export function SambutanSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-0 sambutan-section max-w-7xl mx-auto py-6">
      <div className="flex flex-col-reverse md:flex-row items-start justify-between w-full relative ">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <IconSchool aria-hidden="true" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Sambutan Kepala Sekolah
            </h2>
          </div>

          <p
            className={`prose dark:prose-invert max-w-none prose-p:tracking-tight prose-p:text-balance prose-lg mt-3.5 ${
              expanded ? "line-clamp-none" : "line-clamp-4"
            } md:line-clamp-none`}
          >
            Bismillaahirrahmaanirrahiim, Assalamu'alaikum Wr. Wb. Shalom, Om
            Swastiastu, Namo Budaya, Salam Kebajikan. Selamat Sejahtera bagi
            kita semua. Saya merasa sangat bangga dan terhormat dapat menyambut
            Anda di situs web resmi sekolah kami. Situs ini kami hadirkan
            sebagai wujud komitmen kami dalam memberikan akses lebih luas kepada
            Anda semua mengenai segala informasi terkait kegiatan pendidikan,
            perkembangan terbaru, dan pencapaian gemilang yang telah kami raih
            bersama. Kami ingin mengucapkan terima kasih kepada semua pihak yang
            telah memberikan dukungan tanpa henti kepada SMPN 4 MUNCAR SATU ATAP
            Dan para guru yang berdedikasi hingga orang tua yang mendukung
            Terima kasih atas kepercayaan Anda kepada SMPN 4 MUNCAR SATU ATAP.
            Mari kita bersama-sama mengukir jejak gemilang di dunia pendidikan.{" "}
            <br />
            <span className="italic">Munawar Cholil, S. Pd, M. Pd</span>
          </p>
          <Button
            className="mt-3.5 md:hidden"
            variant="outline"
            size="sm"
            onClick={() => {
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
          </Button>
        </div>

        <MyImage
          src="https://dvwrfhxzfftjxcpxusfd.supabase.co/storage/v1/object/public/blog-images/guru/kepalasekolahbaru.webp"
          alt="Foto Kepala Sekolah"
          width={400}
          height={600}
          className="h-96 p-6 md:p-0 object-cover"
        />
      </div>
    </div>
  );
}
