import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ConstructionInquiryForm } from "@/components/forms/construction-inquiry-form";
import { images } from "@/lib/image-manifest";
import { projects } from "@/lib/projects";

const services = [
  {
    title: "Custom Decks & Outdoor Structures",
    desc: "Composite and hardwood decks, railings, stairs, and exterior structures built to last.",
  },
  {
    title: "Fences & Property Structures",
    desc: "Custom fencing, gates, and site-built outdoor features tailored to your land.",
  },
  {
    title: "Basement & Interior Builds",
    desc: "Full basement renovations, structural upgrades, and finished interior construction.",
  },
  {
    title: "Ground-Up Project Management",
    desc: "Design, engineering, permitting, and construction oversight from concept to completion.",
  },
];

const steps = [
  {
    n: "01",
    title: "Design & scope",
    desc: "We walk the site, understand your goals, and translate them into a clear plan and transparent quote.",
  },
  {
    n: "02",
    title: "Build with craft",
    desc: "Meticulous framing, premium materials, and hidden-fastener finishes — done right the first time.",
  },
  {
    n: "03",
    title: "Finish on time",
    desc: "A single point of contact, steady communication, and a completion date we actually hit.",
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
            <br />
            built to be lived on.
          </>
        }
        subtitle="Custom deck building, renovations, and full-scope construction across Woodstock and the Hudson Valley — quality craftsmanship, transparent pricing, on-time completion."
        cta={
          <>
            <Link
              href="#inquiry"
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Get a Quote
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-white/30 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              View Our Work
            </Link>
          </>
        }
      />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="What we do"
          title="A single crew for the whole build"
          description="From outdoor structures to full interior renovations, we manage every phase — so you get one point of contact and a cohesive result."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 80}
              className="group bg-card p-8 transition-colors hover:bg-secondary sm:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {service.title}
                </h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {service.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach band with alt image */}
      <section className="relative overflow-hidden border-y border-border">
        <Image
          src={images["construction-hero-alt"].src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={images["construction-hero-alt"].blurDataURL}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading
            eyebrow="How we work"
            title="Clear process, no surprises"
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <span className="font-display text-4xl font-semibold text-primary/80">
                  {step.n}
                </span>
                <div className="hairline my-5" />
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
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
                  href="tel:+15551234567"
                  className="font-display text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
                >
                  (555) 123-4567
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
