import Image from "next/image";
import type { ReactNode } from "react";
import { images, type ImageKey } from "@/lib/image-manifest";
import { cn } from "@/lib/utils";

type HeroProps = {
  imageKey: ImageKey;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  cta?: ReactNode;
  className?: string;
  /** Tailwind min-height class for the hero section. */
  minHeightClass?: string;
  /** Priority-load the hero image (true for the first hero on a page). */
  priority?: boolean;
};

export function Hero({
  imageKey,
  eyebrow,
  title,
  subtitle,
  cta,
  className,
  minHeightClass = "min-h-[92vh]",
  priority = true,
}: HeroProps) {
  const img = images[imageKey];

  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden",
        minHeightClass,
        className
      )}
    >
      <Image
        src={img.src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={img.blurDataURL}
        className="object-cover"
      />
      {/* Bottom-weighted gradient so headline text sits directly on the image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pb-28">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="eyebrow mb-5 text-white/70">{eyebrow}</p>
          ) : null}
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {cta ? <div className="mt-9 flex flex-wrap gap-3">{cta}</div> : null}
        </div>
      </div>
    </section>
  );
}
