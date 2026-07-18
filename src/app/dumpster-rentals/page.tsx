import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { ContactForm } from "@/components/forms/contact-form";
import { images } from "@/lib/image-manifest";

export const metadata: Metadata = {
  title: "Dumpster Rentals",
  description:
    "Driveway-safe dump trailer rentals for contractors and homeowners in Woodstock, NY. Same-week availability, transparent pricing, on-time delivery and pickup.",
};

const stats = [
  { value: "100%", label: "On-time rate" },
  { value: "0", label: "Surprise fees" },
  { value: "Same wk", label: "Availability" },
];

const commonProjects = [
  { title: "Home & Estate Cleanouts", desc: "Furniture, household junk, storage cleanouts." },
  { title: "Renovation & Demolition Debris", desc: "Drywall, lumber, fixtures, flooring." },
  { title: "Contractor Job Sites", desc: "Remodels, tear-outs, ongoing projects." },
  { title: "Garage, Basement & Attic", desc: "Bulk waste, old materials, clutter." },
];

const benefits = [
  {
    title: "Easier driveway access",
    desc: "A lower profile fits tight spaces and steep driveways that roll-offs can't reach.",
  },
  {
    title: "Lower height for loading",
    desc: "No climbing required — load directly from ground level or small steps.",
  },
  {
    title: "Faster drop-off & pickup",
    desc: "Quick hydraulic dump means less time blocking your driveway or job site.",
  },
  {
    title: "Less surface damage",
    desc: "Lighter weight distribution protects driveways and asphalt better than roll-offs.",
  },
];

const steps = [
  "Send your request with the form.",
  "We call or text to confirm time, price, and placement.",
  "We drop the trailer, you fill it, and we pick it up.",
];

export default function DumpsterRentalsPage() {
  return (
    <>
      <Hero
        imageKey="dumpster-hero"
        eyebrow="Local Dump Trailer Rental"
        title={
          <>
            On-time delivery
            <br />
            &amp; pickup. No delays.
          </>
        }
        subtitle="Driveway-safe dump trailers for contractors and homeowners. Same-week availability, transparent pricing, zero surprises."
        cta={
          <>
            <Link
              href="#schedule"
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Schedule a Trailer
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-white/30 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Contact the Owner
            </Link>
          </>
        }
      />

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border px-5 sm:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-8 text-center sm:py-10">
              <div className="font-display text-2xl font-semibold text-primary sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common projects */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="What we handle"
          title="Driveway-safe drop-off & pickup"
          description="For cleanouts, remodels, and demolition debris — big or small."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commonProjects.map((job, i) => (
            <Reveal
              key={job.title}
              delay={i * 70}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {job.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {job.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why dump trailer */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading
            eyebrow="Trailer vs. roll-off"
            title="Better access, faster service, less damage"
          />
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 70}>
                <div className="hairline mb-5" />
                <h3 className="font-display text-xl font-semibold tracking-tight text-primary">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {benefit.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Schedule a dump trailer
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us what you need and we&apos;ll confirm details and pricing.
            </p>
            <div className="mt-8">
              <AppointmentForm />
            </div>
          </Reveal>

          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-5">How it works</p>
              <ol className="space-y-5">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-display text-lg font-semibold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(["dumpster-1", "dumpster-2"] as const).map((key) => {
                const img = images[key];
                return (
                  <div
                    key={key}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary"
                  >
                    <Image
                      src={img.src}
                      alt="Dump trailer on a job site"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={img.blurDataURL}
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Need something sooner than the date picker shows? Use the contact
              form below or call directly and we&apos;ll see what we can do.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Questions first?"
              title="Contact the owner"
              description="Ask about pricing, materials, timelines, or job sites — reach out directly and we'll get right back to you."
            />
            <div className="mt-10 space-y-6">
              <div className="hairline" />
              <div>
                <p className="eyebrow mb-2">Call or text</p>
                <a
                  href="tel:+15551234567"
                  className="font-display text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
                >
                  (555) 123-4567
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Service area &amp; hours</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Woodstock &amp; surrounding areas · Mon–Sat, 7:00am–6:00pm
                </p>
              </div>
            </div>
          </div>

          <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
