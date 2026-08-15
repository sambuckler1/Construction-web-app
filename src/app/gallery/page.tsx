import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Slideshow } from "@/components/slideshow";
import {
  extraCover,
  extraKey,
  galleryExtras,
  projectImages,
  projectKey,
  projects,
} from "@/lib/projects";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Selected deck, fence, and construction projects across Woodstock and the Hudson Valley — materials, details, and the story behind each build.",
};

export default function GalleryPage() {
  return (
    <>
      <Hero
        imageKey="gallery-hero"
        minHeightClass="min-h-[55svh]"
        eyebrow="Selected work"
        title="Craftsmanship, project by project"
        subtitle="A closer look at recent decks, fences, and interior builds — the materials we chose and why."
      />

      {/* Link over to the structural / framing gallery */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
        <Reveal>
          <Link
            href="/how-we-frame"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary px-7 py-3 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary-foreground"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              See how we frame
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {projects.map((project, idx) => {
            const slides = projectImages(project);
            const reversed = idx % 2 === 1;
            return (
              <Reveal
                key={projectKey(project)}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Slideshow slides={slides} alt={project.title} />

                <div>
                  <p className="eyebrow">{project.location}</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
                    {project.details}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* More builds — single-image, captioned grid */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24 lg:pb-32">
        <SectionHeading
          eyebrow="More of our work"
          title="A wider look"
          description="A range of decks, rails, and finish details from recent builds."
        />
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {galleryExtras.map((extra, i) => {
            const img = extraCover(extra);
            if (!img) return null;
            return (
              <Reveal key={extraKey(extra)} delay={(i % 3) * 90}>
                <div className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
                    <Image
                      src={img.src}
                      alt={extra.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={img.blurDataURL}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold leading-snug tracking-tight">
                    {extra.title}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-24 lg:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Like what you see?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Tell us about your project and we&apos;ll bring the same care to
              your build.
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
