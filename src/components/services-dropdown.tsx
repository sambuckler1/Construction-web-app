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
        className="group flex w-full items-center justify-between gap-4 border-b border-border py-4 text-left"
      >
        <span className="flex items-baseline gap-3">
          {eyebrow ? (
            <span className="eyebrow hidden shrink-0 sm:inline">{eyebrow}</span>
          ) : null}
          <span className="text-balance font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-xl">
            {title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-primary",
            open && "rotate-180"
          )}
        />
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
