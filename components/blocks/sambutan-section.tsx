"use client";
import MyImage from "@/components/ui/image";
import { useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Button } from "@/components/ui/button";

export default function SambutanSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="mt-3.5 pt-6 px-0 md:px-4 ">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between w-full border-t border-b border-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Sambutan Kepala Sekolah
            </h2>
            <p
              className={`prose dark:prose-invert max-w-none prose-p:tracking-tight prose-p:text-balance prose-lg mt-3.5 ${
                expanded ? "line-clamp-none" : "line-clamp-4"
              } md:line-clamp-none`}
            >
              Bismillaahirrahmaanirrahiim, Assalamu'alaikum Wr. Wb. Shalom, Om
              Swastiastu, Namo Budaya, Salam Kebajikan. Selamat Sejahtera bagi
              kita semua. Saya merasa sangat bangga dan terhormat dapat
              menyambut Anda di situs web resmi sekolah kami. Situs ini kami
              hadirkan sebagai wujud komitmen kami dalam memberikan akses lebih
              luas kepada Anda semua mengenai segala informasi terkait kegiatan
              pendidikan, perkembangan terbaru, dan pencapaian gemilang yang
              telah kami raih bersama. Kami ingin mengucapkan terima kasih
              kepada semua pihak yang telah memberikan dukungan tanpa henti
              kepada SMPN 4 MUNCAR SATU ATAP Dan para guru yang berdedikasi
              hingga orang tua yang mendukung Terima kasih atas kepercayaan Anda
              kepada SMPN 4 MUNCAR SATU ATAP. Mari kita bersama-sama mengukir
              jejak gemilang di dunia pendidikan. <br />
              <span className="italic">H. Imam Najeh, M.Pd</span>
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
            src="/assets/guru/kepalasekolah.jpg"
            alt="Foto Kepala Sekolah"
            width={400}
            height={600}
            className="h-96 p-6 md:p-0 object-cover"
          />
        </div>
        <div className="w-full h-full border-b">
          <div className="p-3 md:p-6 w-full h-full ">
            <h2 className="text-2xl font-bold tracking-tight mb-3.5">
              Profile Sekolah
            </h2>
            <LiteYouTubeEmbed
              aspectHeight={9}
              aspectWidth={16}
              id="5HpHIbxkAV4"
              title="s,p"
            />
          </div>
        </div>
      </div>
    </>
  );
}
