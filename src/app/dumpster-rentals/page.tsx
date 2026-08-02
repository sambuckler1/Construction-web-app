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
    "Up to 12-yard capacity driveway-safe dump trailer rentals for contractors and homeowners in Woodstock, NY. Same-week availability, transparent pricing, on-time delivery and pickup.",
};



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
            <br className="hidden sm:block" />{" "}
            &amp; pickup. No delays.
          </>
        }
        subtitle="Driveway-safe dump trailers for contractors and homeowners."
        cta={
          <>
            <Link
              href="#schedule"
              className="w-full rounded-full bg-primary px-7 py-3 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              Schedule a Trailer
            </Link>
            <Link
              href="#contact"
              className="w-full rounded-full border border-white/30 bg-white/5 px-7 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto"
            >
              Contact the Owner
            </Link>
          </>
        }
      />


      {/* Schedule */}
      <section id="schedule" className="scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-32">
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
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-32">
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
