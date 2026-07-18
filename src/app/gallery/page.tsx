import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { images } from "@/lib/image-manifest";
import { projects } from "@/lib/projects";

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
        minHeightClass="min-h-[62vh]"
        eyebrow="Selected work"
        title="Craftsmanship, project by project"
        subtitle="A closer look at recent decks, fences, and interior builds — the materials we chose and why."
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="space-y-24 sm:space-y-32">
          {projects.map((project, idx) => {
            const img = images[project.imageKey];
            const reversed = idx % 2 === 1;
            return (
              <Reveal
                key={project.imageKey}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary">
                  <Image
                    src={img.src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={img.blurDataURL}
                    className="object-cover"
                  />
                </div>

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

      {/* CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
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
