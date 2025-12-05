"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import MyImage from "@/components/ui/image";

export interface Gallery4Item {
  id: string;
  nama: string;
  role?: string;
  image_url: string;
}

export interface Gallery4Props {
  nameSection?: string;
  description?: string;
  items: Gallery4Item[];
}

export const TemplateCarousel = ({ items, nameSection }: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="border-b border-border pb-4">
      <div className="container mx-auto">
        <div className="flex items-end justify-between md:mb-14 lg:mb-16 px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{nameSection}</h2>
            <p>{nameSection} SMP Negeri 04 Muncar Satu Atap</p>
          </div>

          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
              aria-label="previous-btn"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
              aria-label="next-btn"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full mt-5 md:-mt-10">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px] py-3"
              >
                <div className="relative group flex min-w-0 h-full min-h-[28rem] flex-col rounded-2xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72">
                  <div className="-m-px border bg-background p-1 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] rounded-t-2xl rounded-b-xl dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
                    <div>
                      <div className="relative w-full h-96 overflow-hidden">
                        <MyImage
                          src={item.image_url}
                          alt={item.nama}
                          fill
                          className="object-cover transition-transform duration-300 rounded-xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-b-2xl flex flex-col justify-between items-center gap-2 py-2">
                    <span className="text-lg font-semibold group-hover:underline">
                      {item.nama}
                    </span>
                    {item.role && (
                      <span className="line-clamp-2">{item.role}</span>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/*<div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 mx-1 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>*/}
      </div>
    </section>
  );
};
