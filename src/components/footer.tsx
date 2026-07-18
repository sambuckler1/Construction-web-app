import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              Woodstock Renewal Contracting
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Custom decks, renovations, and full-scope construction across
              Woodstock and the Hudson Valley. Built right, finished on time.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Construction
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/dumpster-rentals"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dumpster Rentals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Get in touch</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Woodstock, NY &amp; surrounding areas</li>
              <li>Mon–Sat · 7:00am – 6:00pm</li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="transition-colors hover:text-foreground"
                >
                  (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {year} Woodstock Renewal Contracting. All rights reserved.</span>
          <span>Licensed &amp; Insured</span>
        </div>
      </div>
    </footer>
  );
}
