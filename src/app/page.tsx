import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServicesDropdown } from "@/components/services-dropdown";
import { ConstructionInquiryForm } from "@/components/forms/construction-inquiry-form";
import { images } from "@/lib/image-manifest";
import { projects } from "@/lib/projects";

const services = [
  {
    title: "Custom Decks",
    desc: "Composite decking, Hardwood decking, Pine decking, and more. Cable rails, aluminum rails, composite rails, traditional wood rails, and more. Solid and careful framing & flashing with deep, strong footings make for a lasting deck.",
  },
  {
    title: "Ground-Up Construction",
    desc: "New builds and additions, accessory dwelling units.",
  },
  {
    title: "General Construction",
    desc: "Renovations, repairs, and the range of projects in between — just ask.",
  },
];

const steps = [
  {
    n: "01",
    title: "Design & scope",
    desc: "We walk the site, understand your goals, and can provide recommendations from years of experience.",
  },
  {
    n: "02",
    title: "Build with craft",
    desc: "From foundation to finish, each step is carried out with care and percision.",
  },
  {
    n: "03",
    title: "Finish a beautiful product",
    desc: "Steady communication with reliable people until the very end.",
  },
];

const teaser = projects.slice(0, 3);

export default function ConstructionPage() {
  return (
    <>
      <Hero
        imageKey="construction-hero"
        eyebrow="Woodstock, NY · Licensed & Insured"
        title={
          <>
            Decks and construction,
            <br className="hidden sm:block" />{" "}
            built to be lived on.
          </>
        }
        subtitle="Custom deck building, renovations, and full-scope construction across Woodstock and the Hudson Valley."
        cta={
          <>
            <Link
              href="#inquiry"
              className="w-full rounded-full bg-primary px-7 py-3 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              Get a Quote
            </Link>
            <Link
              href="/gallery"
              className="w-full rounded-full border border-white/30 bg-white/5 px-7 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto"
            >
              View Our Work
            </Link>
          </>
        }
      />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
        <Reveal>
          <ServicesDropdown
            eyebrow="What we do"
            title="Custom decks, and everything we build around them"
            description="We handle everything: initial design based on your goals and vision, engineered plans, permits, physical job execution, and inspections."
            services={services}
          />
        </Reveal>
      </section>

      {/* Approach band with alt image */}
      <section className="relative overflow-hidden border-y border-border">
        <Image
          src={images["construction-hero-alt"].src}
          alt=""
          fill
          sizes="(max-width: 640px) 200vw, 100vw"
          placeholder="blur"
          blurDataURL={images["construction-hero-alt"].blurDataURL}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-24 lg:py-32">
          <SectionHeading
            eyebrow="How we work"
            title="Clear process, no surprises"
          />
          <div className="mt-8 grid gap-6 sm:mt-14 sm:gap-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <span className="font-display text-3xl font-semibold text-primary/80 sm:text-4xl">
                  {step.n}
                </span>
                <div className="hairline my-3 sm:my-5" />
                <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Recent projects"
            description="A glimpse of what we build. Explore the full gallery for materials, details, and the story behind each one."
          />
          <Reveal>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              View full gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {teaser.map((project, i) => {
            const img = images[project.imageKey];
            return (
              <Reveal key={project.imageKey} delay={i * 90}>
                <Link href="/gallery" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
                    <Image
                      src={img.src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={img.blurDataURL}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="eyebrow mt-4">{project.location}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight">
                    {project.title}
                  </h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Inquiry */}
      <section
        id="inquiry"
        className="scroll-mt-24 border-t border-border bg-card/40"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Start your project"
              title="Tell us what you're building"
              description="Share a few details and we'll come back with a clear quote and timeline. No pressure, no surprise fees."
            />
            <div className="mt-10 space-y-6">
              <div className="hairline" />
              <div>
                <p className="eyebrow mb-2">Prefer to talk?</p>
                <a
                  href="tel:+18457682488"
                  className="font-display text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
                >
                  (845) 768-2488
                </a>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Serving Woodstock and the surrounding Hudson Valley. Mon–Sat,
                7:00am–6:00pm.
              </p>
            </div>
          </div>

          <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ConstructionInquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
