"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OptimizedImage } from "@/lib/image-manifest";
import { cn } from "@/lib/utils";

type SlideshowProps = {
  slides: readonly OptimizedImage[];
  alt: string;
  className?: string;
  /** Auto-advance interval in ms. Set 0 to disable autoplay. */
  interval?: number;
};

export function Slideshow({
  slides,
  alt,
  className,
  interval = 5500,
}: SlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  );

  // Autoplay, paused on hover/focus and when reduced motion is preferred.
  const reduceRef = useRef(false);
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (count <= 1 || interval <= 0 || paused || reduceRef.current) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      interval
    );
    return () => window.clearInterval(id);
  }, [count, interval, paused]);

  if (count === 0) return null;

  const single = count === 1;

  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={single ? alt : `${alt} — image ${i + 1} of ${count}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={slide.blurDataURL}
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== index}
          priority={i === 0}
        />
      ))}

      {!single ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
