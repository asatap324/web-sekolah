import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="py-12 relative">
      {/*<Image
        className="w-full h-full absolute inset-0 -z-10 dark:invert brightness-0 hidden md:block"
        src="/assets/1-1.png"
        alt="hero-image"
        priority
        fill
        sizes="100vw"
      />*/}
      <section className="w-full h-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-7xl px-4 mx-auto">
        <div className="space-y-3.5">
          <Badge variant="outline" className="gap-1.5">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            ></span>
            Selamat Datang Di Website Kami
          </Badge>

          <h3 className="text-4xl md:text-6xl font-semibold">
            SMPN 04 Muncar <br />
            Satu Atap
          </h3>

          <p className="text-base md:text-lg text-foreground my-4 md:my-6">
            Raih pendidikan berkualitas di SMP Negeri 4 Muncar Satu Atap
            Banyuwangi. Daftar sekarang untuk masa depan gemilang anak Anda!
          </p>

          <Button
            className=" font-medium py-2 px-4 rounded transition-all  active:scale-95"
            asChild
          >
            <Link
              href="https://spmb.id/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ayo Daftar Sekarang!
            </Link>
          </Button>
        </div>
        <div>
          <video
            className="w-full h-full sm:aspect-video object-cover brightness-75 rounded-md"
            src="/Homepage1.mp4"
            muted
            loop
            autoPlay
            preload="metadata"
            playsInline
          />
        </div>
      </section>
    </div>
  );
}
