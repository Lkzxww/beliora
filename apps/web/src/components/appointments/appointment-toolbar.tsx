"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AppointmentViewMode } from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentToolbarProps = Readonly<{
  monthLabel: string;
  onGoToNextWeek: () => void;
  onGoToPreviousWeek: () => void;
  onGoToToday: () => void;
  selectedView: AppointmentViewMode;
  viewOptions: Array<{
    label: string;
    value: AppointmentViewMode;
  }>;
  weekLabel: string;
}>;

export function AppointmentToolbar({
  monthLabel,
  onGoToNextWeek,
  onGoToPreviousWeek,
  onGoToToday,
  selectedView,
  viewOptions,
  weekLabel,
}: AppointmentToolbarProps) {
  return (
    <div className="border-b border-[#efe4d8] px-4 py-4 dark:border-white/10 sm:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onGoToToday}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#e2d6c8] bg-white/75 px-5 text-sm font-semibold text-[#332b26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d7c6b3] hover:bg-white hover:shadow-[0_14px_30px_rgba(48,37,28,0.08)] active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
          >
            Hoje
          </button>

          <div
            className="flex h-12 min-w-0 items-center rounded-2xl border border-[#e2d6c8] bg-[#fffbf5] shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            aria-label={`Semana ${weekLabel}`}
          >
            <button
              type="button"
              onClick={onGoToPreviousWeek}
              aria-label="Semana anterior"
              className="grid size-12 shrink-0 place-items-center rounded-l-2xl text-[#6f6258] transition-all duration-200 hover:bg-[#f6eadb] hover:text-[#7a2638] active:translate-y-px dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <div className="min-w-[11rem] px-4 text-center sm:min-w-[13rem]">
              <p className="truncate text-base font-semibold text-[#211b18] dark:text-foreground">
                {monthLabel}
              </p>
              <p className="mt-0.5 truncate text-[0.72rem] font-medium text-[#8a7d72] dark:text-muted-foreground">
                {weekLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToNextWeek}
              aria-label="Próxima semana"
              className="grid size-12 shrink-0 place-items-center rounded-r-2xl text-[#6f6258] transition-all duration-200 hover:bg-[#f6eadb] hover:text-[#7a2638] active:translate-y-px dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          aria-label="Visualização da agenda"
          className="grid h-12 grid-cols-3 rounded-2xl border border-[#e2d6c8] bg-[#f8eedf] p-1 shadow-inner shadow-white/40 dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:w-fit"
        >
          {viewOptions.map((option) => {
            const isActive = option.value === selectedView;

            return (
              <Link
                key={option.value}
                href={`/agenda?view=${option.value}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 min-w-24 items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#74675d] transition-all duration-200 hover:bg-white/45 hover:text-[#211b18] active:translate-y-px dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground",
                  isActive &&
                    "bg-white text-[#7a2638] shadow-[0_10px_22px_rgba(48,37,28,0.08)] dark:bg-white/10 dark:text-[#f0bcc8]",
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
