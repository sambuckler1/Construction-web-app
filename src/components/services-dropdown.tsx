"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  title: string;
  desc: string;
};

type ServicesDropdownProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  services: Service[];
  /** Whether the section is expanded on first render. */
  defaultOpen?: boolean;
};

export function ServicesDropdown({
  eyebrow,
  title,
  description,
  services,
  defaultOpen = false,
}: ServicesDropdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = "services-panel";
  const triggerId = "services-trigger";

  return (
    <div>
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 text-left transition-colors hover:border-primary/50 hover:bg-secondary/50 sm:px-6",
          open ? "border-primary/50 bg-secondary/40" : "border-border"
        )}
      >
        <span className="flex flex-col gap-0.5">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <span className="text-balance font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {title}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-primary sm:inline">
            {open ? "Hide" : "View"}
          </span>
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              open
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </span>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}

          <div className="mt-6 border-t border-border">
            <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12 sm:py-10">
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:w-2/5 sm:text-3xl">
                {services[0].title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:w-3/5 sm:max-w-xl sm:text-base">
                {services[0].desc}
              </p>
            </div>

            <div className="grid border-b border-border sm:grid-cols-2">
              {services.slice(1).map((service, i) => (
                <div
                  key={service.title}
                  className={cn(
                    "flex flex-col gap-2 py-6 sm:py-8",
                    i === 0
                      ? "border-b border-border sm:border-b-0 sm:border-r sm:pr-8"
                      : "sm:pl-8"
                  )}
                >
                  <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
