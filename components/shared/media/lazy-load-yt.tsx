"use client";
import { useEffect, useRef, useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface OptimizedYouTubeProps {
  id: string;
  title: string;
  wrapperClass?: string;
  playerClass?: string;
  iframeClass?: string;
}

export function OptimizedYouTube({
  id,
  title,
  wrapperClass = "yt-lite rounded-md",
  playerClass = "lty-playbtn",
  iframeClass = "",
}: OptimizedYouTubeProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Load 200px sebelum masuk viewport
        threshold: 0.1,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {shouldLoad && (
        <LiteYouTubeEmbed
          id={id}
          title={title}
          wrapperClass={wrapperClass}
          playerClass={playerClass}
          iframeClass={iframeClass}
          // Tambahkan props untuk optimasi lebih lanjut
          poster="hqdefault" // "maxresdefault" | "hqdefault" | "sddefault"
          webp={true} // Gunakan webp untuk poster (lebih kecil)
        />
      )}
    </div>
  );
}
