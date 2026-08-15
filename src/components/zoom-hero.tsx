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
  /** transform-origin for the wide layer's initial zoomed-in crop. */
  wideOrigin?: string;
  /** object-position for the wide image once settled. */
  wideObjectPosition?: string;
  /** Starting scale of the wide layer (zoomed in on the corner). */
  wideStartScale?: number;
  /** Ending scale of the close layer as it pushes past and fades out. */
  closeEndScale?: number;
  /** Constant tilt (deg) for the close-up; negative is counter-clockwise. */
  closeRotate?: number;
  /** Constant tilt (deg) for the wide shot; positive is clockwise. */
  wideRotate?: number;
  /** Overscan applied with tilt so rotated corners never expose gaps. */
  overscan?: number;
  /** Zoom duration in ms (fixed speed, independent of scroll). */
  duration?: number;
};

// Smooth, slow-start/slow-end easing so the zoom reads as a steady camera
// pull-back rather than a punchy snap (which also shrank the close-up out of
// coverage too fast).
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// Uniform scale so a layer tilted by `deg` still fully covers the frame,
// assuming a viewport aspect ratio up to `aspect` (covers wide desktops and
// tall phones). A small margin guards against sub-pixel seams.
function coverScale(deg: number, aspect = 2.1, margin = 1.015): number {
  const t = (Math.abs(deg) * Math.PI) / 180;
  return (Math.cos(t) + aspect * Math.sin(t)) * margin;
}

export function ZoomHero({
  closeKey,
  wideKey,
  eyebrow,
  title,
  subtitle,
  cta,
  className,
  wideOrigin = "45% 30%",
  wideObjectPosition = "center",
  wideStartScale = 2.6,
  closeEndScale,
  closeRotate = -1.2,
  wideRotate = 5.7,
  overscan = 1.14,
  duration = 1200,
}: ZoomHeroProps) {
  const close = images[closeKey];
  const wide = images[wideKey];

  // Keep the close-up at (or very near) full-bleed. Scaling it with the wide
  // shot (1 / wideStartScale ≈ 0.38) shrinks it into a hard rectangle mid-zoom.
  // The camera pull-back lives on the wide layer; the close-up just dissolves
  // away while it still covers the frame.
  const closeEnd = closeEndScale ?? 1;
  const fadeMs = Math.round(duration * 0.22);

  // `zoomed` drives the fixed-duration CSS transition; `instant` snaps to the
  // settled wide state with no animation (reduced motion / mounted scrolled).
  const [zoomed, setZoomed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.scrollY > 4
    ) {
      setInstant(true);
      setZoomed(true);
      return;
    }

    // Phase: "idle" -> the page is held at the top and the first scroll intent
    // starts the zoom; "playing" -> scroll stays locked while the fixed-speed
    // zoom runs in-frame; "done" -> normal scrolling resumes.
    let phase: "idle" | "playing" | "done" = "idle";
    const scrollKeys = new Set([
      "ArrowDown",
      "PageDown",
      "End",
      " ",
      "Spacebar",
    ]);

    const begin = () => {
      if (phase !== "idle") return;
      phase = "playing";
      window.scrollTo(0, 0);
      setZoomed(true);
      window.setTimeout(finish, duration + 60);
    };

    const finish = () => {
      phase = "done";
      window.removeEventListener("wheel", onBlock);
      window.removeEventListener("touchmove", onBlock);
      window.removeEventListener("keydown", onKey);
    };

    // Block scroll until the zoom finishes; the first blocked gesture kicks it
    // off, so the hero can never scroll away mid-animation.
    const onBlock = (e: Event) => {
      if (phase === "done") return;
      e.preventDefault();
      begin();
    };
    const onKey = (e: KeyboardEvent) => {
      if (phase === "done" || !scrollKeys.has(e.key)) return;
      e.preventDefault();
      begin();
    };

    window.addEventListener("wheel", onBlock, { passive: false });
    window.addEventListener("touchmove", onBlock, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onBlock);
      window.removeEventListener("touchmove", onBlock);
      window.removeEventListener("keydown", onKey);
    };
  }, [duration]);

  const wideStyle: CSSProperties = {
    transform: zoomed ? "scale(1)" : `scale(${wideStartScale})`,
    transformOrigin: wideOrigin,
    transition: instant ? "none" : `transform ${duration}ms ${EASE}`,
    willChange: "transform",
  };

  const closeStyle: CSSProperties = {
    transform: zoomed ? `scale(${closeEnd})` : "scale(1)",
    transformOrigin: wideOrigin,
    opacity: zoomed ? 0 : 1,
    visibility: zoomed ? "hidden" : "visible",
    transition: instant
      ? "none"
      : `transform ${duration}ms ${EASE}, opacity ${fadeMs}ms linear, visibility 0s linear ${fadeMs}ms`,
    willChange: "transform, opacity",
  };

  // Constant tilt lives on an inner wrapper so it composes with (but isn't
  // driven by) the zoom scale. A tilted layer must be scaled up enough to
  // still cover the frame; the required amount grows with the angle and the
  // viewport's aspect ratio, so compute it. `overscan` is a floor.
  const closeTilt: CSSProperties = {
    transform: `rotate(${closeRotate}deg) scale(${Math.max(
      overscan,
      coverScale(closeRotate)
    )})`,
  };
  const wideTilt: CSSProperties = {
    transform: `rotate(${wideRotate}deg) scale(${Math.max(
      overscan,
      coverScale(wideRotate)
    )})`,
  };

  return (
    <section
      className={cn(
        "relative flex min-h-[100svh] items-end overflow-hidden",
        className
      )}
    >
      {/* Wide shot underneath, starts zoomed into the corner detail. */}
      <div className="absolute inset-0" style={wideStyle}>
        <div className="absolute inset-0" style={wideTilt}>
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
      </div>

      {/* Close-up on top, scales past and fades out to reveal the wide shot. */}
      <div className="absolute inset-0" style={closeStyle}>
        <div className="absolute inset-0" style={closeTilt}>
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
      </div>

      {/* Gradient + scrim for headline legibility, present the whole time. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Headline / CTA, always visible over both the close-up and wide shot. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
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
