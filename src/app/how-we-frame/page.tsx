import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { galleries } from "@/lib/image-manifest";

export const metadata: Metadata = {
  title: "How We Frame",
  description:
    "The structure behind our decks — precisely calculated footings below the frost line, solid framing, drop and flush beams, and carefully flashed ledger boards.",
};

const framing = galleries["deck-framing"];

export default function HowWeFramePage() {
  return (
    <>
      <Hero
        imageKey="framing-hero"
        minHeightClass="min-h-[55svh]"
        eyebrow="Structure first"
        title="How we frame"
        subtitle="A deck is only as good as what holds it up. Here's the structure beneath the surface."
      />

      {/* Structural overview — one thin, deliberate band */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4">Built from the ground up</p>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Every deck starts below the frost line with footings sized and
            placed to handle dead and live loads for every soil type. On top is
            a frame that can withstand years of vertical and lateral forces.
            With rain and snow in mind, we seal the tops of all our frames. Our
            staircases are robustly constructed with 12&quot; OC stringer
            spacing, solid riser blocking, proper foundation, and secure
            attachment to the deck.
          </p>
        </Reveal>
      </section>

      {/* Framing image grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {framing.map((slide, i) => (
            <Reveal key={slide.src} delay={(i % 3) * 90}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
                <Image
                  src={slide.src}
                  alt={`Deck framing detail ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={slide.blurDataURL}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-24 lg:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Building on solid ground?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Tell us about your project and we&apos;ll build it to last, from
              the footings up.
            </p>
            <Link
              href="/#inquiry"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Start your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
