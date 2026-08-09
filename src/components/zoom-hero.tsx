"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { images, type ImageKey } from "@/lib/image-manifest";
import { cn } from "@/lib/utils";

type ZoomHeroProps = {
  /** Close-up image shown first (hero-1). */
  closeKey: ImageKey;
  /** Wide image revealed after the zoom-out (hero-2). */
  wideKey: ImageKey;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  cta?: ReactNode;
  className?: string;
  /** Tailwind min-height class for the hero section. */
  minHeightClass?: string;
  /** transform-origin for the wide layer's initial zoomed-in crop. */
  wideOrigin?: string;
  /** object-position for the wide (portrait) image once settled. */
  wideObjectPosition?: string;
  /** Starting scale of the wide layer (zoomed in on the corner). */
  wideStartScale?: number;
  /** Ending scale of the close layer as it pushes past and fades out. */
  closeEndScale?: number;
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function ZoomHero({
  closeKey,
  wideKey,
  eyebrow,
  title,
  subtitle,
  cta,
  className,
  minHeightClass = "min-h-[88svh]",
  wideOrigin = "50% 26%",
  wideObjectPosition = "50% 38%",
  wideStartScale = 2.6,
  closeEndScale = 1.5,
}: ZoomHeroProps) {
  const close = images[closeKey];
  const wide = images[wideKey];

  // `zoomed` drives the whole animation; `instant` snaps to the final wide
  // state with no transition (reduced motion, or the page mounted scrolled).
  const [zoomed, setZoomed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce || window.scrollY > 4) {
      setInstant(true);
      setZoomed(true);
      return;
    }

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setZoomed(true);
      cleanup();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) trigger();
    };
    const onKey = (e: KeyboardEvent) => {
      const keys = [
        "ArrowDown",
        "PageDown",
        "End",
        " ",
        "Spacebar",
      ];
      if (keys.includes(e.key)) trigger();
    };
    const onTouch = () => trigger();
    const onScroll = () => {
      if (window.scrollY > 0) trigger();
    };

    const cleanup = () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, []);

  const closeStyle: CSSProperties = {
    transform: zoomed ? `scale(${closeEndScale})` : "scale(1)",
    opacity: zoomed ? 0 : 1,
    transition: instant
      ? "none"
      : `transform 1200ms ${EASE}, opacity 800ms ${EASE}`,
    willChange: "transform, opacity",
  };

  const wideStyle: CSSProperties = {
    transform: zoomed ? "scale(1)" : `scale(${wideStartScale})`,
    transformOrigin: wideOrigin,
    transition: instant ? "none" : `transform 1200ms ${EASE}`,
    willChange: "transform",
  };

  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden",
        minHeightClass,
        className
      )}
    >
      {/* Wide shot underneath, starts zoomed into the corner detail. */}
      <div className="absolute inset-0" style={wideStyle}>
        <Image
          src={wide.src}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={wide.blurDataURL}
          className="object-cover"
          style={{ objectPosition: wideObjectPosition }}
        />
      </div>

      {/* Close-up on top, scales past and fades out to reveal the wide shot. */}
      <div className="absolute inset-0" style={closeStyle}>
        <Image
          src={close.src}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={close.blurDataURL}
          className="object-cover object-center"
        />
      </div>

      {/* Overlays fade in with the zoom so the initial close-up stays clean. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out",
          zoomed ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: zoomed && !instant ? "500ms" : "0ms" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Headline / CTA, fade in after the zoom completes. */}
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-28 transition-all duration-700 ease-out sm:px-8 sm:pb-28 sm:pt-32",
          zoomed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{ transitionDelay: zoomed && !instant ? "900ms" : "0ms" }}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="eyebrow mb-5 text-white/70">{eyebrow}</p>
          ) : null}
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {cta ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {cta}
            </div>
          ) : null}
        </div>
      </div>

      {/* Scroll cue, hidden once the zoom fires. */}
      {!instant ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center transition-opacity duration-500",
            zoomed ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="flex flex-col items-center gap-1.5 rounded-full bg-black/30 px-4 py-2.5 text-white/85 backdrop-blur-sm">
            <span className="eyebrow text-white/70">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </span>
        </div>
      ) : null}
    </section>
  );
}
