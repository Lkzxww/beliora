"use client";

import { CalendarDays, Clock3, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";

type ServiceCardProps = Readonly<{
  isSelected?: boolean;
  onSelectService: (service: Service) => void;
  service: Service;
}>;

export function ServiceCard({
  isSelected = false,
  onSelectService,
  service,
}: ServiceCardProps) {
  const isArchived = service.status === "archived";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectService(service)}
      className={cn(
        "group flex min-h-44 w-full cursor-pointer flex-col rounded-[1.5rem] border border-[#eadfd3] bg-white/[0.82] p-4 text-left shadow-[0_12px_34px_rgba(48,37,28,0.06)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(48,37,28,0.1)] focus-visible:ring-3 focus-visible:ring-[#c9a76a]/35 dark:border-white/10 dark:bg-card/[0.78] dark:hover:bg-card",
        isSelected &&
          "border-[#c9a76a] bg-[#fffaf4] shadow-[0_18px_46px_rgba(122,38,56,0.13)] dark:border-[#c9a76a]/60 dark:bg-white/[0.07]",
        isArchived && "opacity-80",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 size-4 shrink-0 rounded-full ring-4 ring-[#f2e6d9] dark:ring-white/10"
          style={{ backgroundColor: service.color }}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6426] dark:text-[#f0d59d]">
                {service.category}
              </p>
              <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-[#211b18] dark:text-foreground">
                {service.name}
              </h2>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 border border-[#d2b675]/30 bg-[#f3e7d4] text-[#2b211b]",
                isArchived &&
                  "border-[#e8c7cf] bg-[#faedf0] text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]",
              )}
            >
              {isArchived ? "Arquivado" : "Ativo"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 text-sm text-[#74675d] dark:text-muted-foreground">
        <p className="flex min-w-0 items-center gap-2">
          <Clock3 className="size-4 shrink-0 text-[#9a8a7a]" aria-hidden="true" />
          <span className="truncate">{service.durationLabel}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <DollarSign
            className="size-4 shrink-0 text-[#9a8a7a]"
            aria-hidden="true"
          />
          <span className="truncate">{service.priceLabel}</span>
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a8a7a] dark:text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-4" aria-hidden="true" />
          Agenda
        </span>
        <span className="text-[#211b18] dark:text-foreground">
          {service.appointmentCount}
        </span>
      </div>
    </button>
  );
}
