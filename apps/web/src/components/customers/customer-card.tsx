"use client";

import { CalendarDays, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/customer";
import { cn } from "@/lib/utils";

type CustomerCardProps = Readonly<{
  customer: Customer;
  isSelected?: boolean;
  onSelectCustomer: (customer: Customer) => void;
}>;

export function CustomerCard({
  customer,
  isSelected = false,
  onSelectCustomer,
}: CustomerCardProps) {
  const isArchived = customer.status === "archived";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectCustomer(customer)}
      className={cn(
        "group flex min-h-44 w-full cursor-pointer flex-col rounded-[1.5rem] border border-[#eadfd3] bg-white/[0.82] p-4 text-left shadow-[0_12px_34px_rgba(48,37,28,0.06)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(48,37,28,0.1)] focus-visible:ring-3 focus-visible:ring-[#c9a76a]/35 dark:border-white/10 dark:bg-card/[0.78] dark:hover:bg-card",
        isSelected &&
          "border-[#c9a76a] bg-[#fffaf4] shadow-[0_18px_46px_rgba(122,38,56,0.13)] dark:border-[#c9a76a]/60 dark:bg-white/[0.07]",
        isArchived && "opacity-80",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#d8c8b6] bg-[#241b17] text-sm font-semibold text-[#f6ead9] shadow-[0_12px_24px_rgba(36,27,23,0.14)] dark:border-white/10">
          {customer.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold leading-6 text-[#211b18] dark:text-foreground">
              {customer.name}
            </h2>
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

          <p className="mt-1 text-sm font-medium text-[#74675d] dark:text-muted-foreground">
            {customer.appointmentCount} atendimentos
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 text-sm text-[#74675d] dark:text-muted-foreground">
        <p className="flex min-w-0 items-center gap-2">
          <Phone className="size-4 shrink-0 text-[#9a8a7a]" aria-hidden="true" />
          <span className="truncate">{customer.phone}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <Mail className="size-4 shrink-0 text-[#9a8a7a]" aria-hidden="true" />
          <span className="truncate">{customer.email ?? "Sem e-mail"}</span>
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a8a7a] dark:text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-4" aria-hidden="true" />
          Proximos
        </span>
        <span className="text-[#211b18] dark:text-foreground">
          {customer.upcomingAppointmentCount}
        </span>
      </div>
    </button>
  );
}
