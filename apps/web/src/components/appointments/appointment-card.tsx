import { Scissors, UserRound } from "lucide-react";

import { AppointmentStatusBadge } from "@/components/appointments/appointment-status";
import type { Appointment } from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentCardProps = Readonly<{
  appointment: Appointment;
  compact?: boolean;
  className?: string;
  isSelected?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
}>;

export function AppointmentCard({
  appointment,
  className,
  compact = false,
  isSelected = false,
  onSelectAppointment,
}: AppointmentCardProps) {
  return (
    <button
      type="button"
      role="option"
      aria-label={`${appointment.customer.name}, ${appointment.service.name}, ${appointment.startTime}`}
      aria-selected={isSelected}
      onClick={() => onSelectAppointment?.(appointment)}
      className={cn(
        "group relative flex h-full min-h-[9.5rem] w-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-[#eadbc9] bg-[#fffaf4] p-5 text-left shadow-[0_10px_26px_rgba(48,37,28,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-[#d6bf9f] hover:bg-white hover:shadow-[0_20px_46px_rgba(48,37,28,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/60 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
        compact && "min-h-[8.75rem] p-4",
        isSelected &&
          "border-[#c9a76a] bg-[#fff6e8] shadow-[0_18px_42px_rgba(122,38,56,0.13)] ring-2 ring-[#c9a76a]/25 hover:border-[#c9a76a] hover:bg-[#fff6e8] dark:border-[#c9a76a]/60 dark:bg-[#c9a76a]/10 dark:ring-[#c9a76a]/20",
        className,
      )}
    >
      <AppointmentStatusBadge
        status={appointment.status}
        className="absolute right-3 top-3 max-w-[5.75rem] overflow-hidden text-ellipsis whitespace-nowrap px-2 py-0.5 text-[0.64rem] leading-4"
      />

      <div className="min-w-0 pr-[5.75rem]">
        <p
          className={cn(
            "whitespace-nowrap text-[0.95rem] font-bold leading-5 text-[#7a2638] dark:text-[#f0bcc8]",
            compact && "text-[0.88rem]",
          )}
        >
          {appointment.startTime} — {appointment.endTime}
        </p>
      </div>

      <div className="mt-3 min-w-0">
        <h3
          className={cn(
            "line-clamp-2 text-base font-semibold leading-6 text-[#211b18] [overflow-wrap:normal] [text-wrap:pretty] dark:text-foreground",
            compact && "text-[0.95rem] leading-5",
          )}
        >
          {appointment.customer.name}
        </h3>

        <p
          className={cn(
            "mt-2 flex min-w-0 items-start gap-2 text-sm font-medium leading-5 text-[#6f6258] dark:text-muted-foreground",
            compact && "mt-1.5 text-xs leading-4",
          )}
        >
          <Scissors
            className="mt-0.5 size-3.5 shrink-0 text-[#a37732]/75"
            aria-hidden="true"
          />
          <span className="line-clamp-2 min-w-0 [overflow-wrap:normal]">
            {appointment.service.name}
          </span>
        </p>
      </div>

      <p
        className={cn(
          "mt-auto flex min-w-0 items-center gap-2 pt-3 text-xs font-medium leading-4 text-[#8b7d72] dark:text-muted-foreground",
          compact && "pt-2 text-[0.72rem]",
        )}
      >
        <UserRound
          className="size-3.5 shrink-0 text-[#a37732]/65"
          aria-hidden="true"
        />
        <span className="truncate">{appointment.professional.name}</span>
      </p>
    </button>
  );
}
