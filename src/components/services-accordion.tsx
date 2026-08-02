"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  title: string;
  desc: string;
};

type ServicesAccordionProps = {
  services: Service[];
  /** Index open on first render. Set to null for all-collapsed. */
  defaultOpen?: number | null;
};

export function ServicesAccordion({
  services,
  defaultOpen = 0,
}: ServicesAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="mt-10 border-t border-border sm:mt-14">
      {services.map((service, i) => {
        const isOpen = open === i;
        const panelId = `service-panel-${i}`;
        const buttonId = `service-trigger-${i}`;

        return (
          <div key={service.title} className="border-b border-border">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                  {service.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-primary",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
