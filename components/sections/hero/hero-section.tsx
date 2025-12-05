"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Variants } from "motion/react";
import { AnimatedGroup } from "@/components/shared/effects/animated-group";

const transitionVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring", // TypeScript sekarang mengenali ini sebagai nilai yang valid
      bounce: 0.3,
      duration: 1.5,
    },
  },
};
export function HeroSection() {
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
          <AnimatedGroup variants={transitionVariants}>
            <div className="hover:bg-background dark:hover:border-t-border bg-muted group flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
              <span className="text-foreground text-sm">
                Selamat Datang Di Website Kami
              </span>
              <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

              <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3" />
                  </span>
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3" />
                  </span>
                </div>
              </div>
            </div>
          </AnimatedGroup>
          <AnimatedGroup
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
              ...transitionVariants,
            }}
          >
            <h1 className="text-4xl md:text-6xl font-semibold">
              SMPN 04 Muncar <br /> Satu Atap
            </h1>
          </AnimatedGroup>
          <AnimatedGroup
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.85,
                },
              },
              ...transitionVariants,
            }}
            className="text-base md:text-lg text-foreground my-4 md:my-6"
          >
            <p className="text-base md:text-lg text-foreground my-4 md:my-6">
              Raih pendidikan berkualitas di SMP Negeri 4 Muncar Satu Atap
              Banyuwangi. Daftar sekarang untuk masa depan gemilang anak Anda!
            </p>
          </AnimatedGroup>

          <AnimatedGroup
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.95,
                },
              },
              ...transitionVariants,
            }}
          >
            <Button
              className=" font-medium py-2 px-4 rounded transition-all  active:scale-95"
              render={
                <Link
                  href="https://spmb.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Ayo Daftar Sekarang!
            </Button>
          </AnimatedGroup>
        </div>
        <AnimatedGroup
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.75,
              },
            },

            ...transitionVariants,
          }}
        >
          <video
            className="w-full h-full sm:aspect-video object-cover brightness-75 rounded-md"
            src="/Homepage1.mp4"
            muted
            loop
            autoPlay
            preload="metadata"
            playsInline
          />
        </AnimatedGroup>
      </section>
    </div>
  );
}
