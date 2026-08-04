import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX2,
} from "lucide-react";

import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentCountersProps = Readonly<{
  appointments: Appointment[];
}>;

type CounterItem = Readonly<{
  className: string;
  icon: typeof CalendarDays;
  label: string;
  value: number;
}>;

function countByStatus(
  appointments: Appointment[],
  status: AppointmentStatus,
) {
  return appointments.filter((appointment) => appointment.status === status)
    .length;
}

export function AppointmentCounters({
  appointments,
}: AppointmentCountersProps) {
  const counters: CounterItem[] = [
    {
      className: "text-[#7a2638] dark:text-[#f0bcc8]",
      icon: CalendarDays,
      label: "Total",
      value: appointments.length,
    },
    {
      className: "text-[#52745e] dark:text-[#a8d6b3]",
      icon: CalendarCheck2,
      label: "Confirmados",
      value: countByStatus(appointments, "confirmed"),
    },
    {
      className: "text-[#9a6b21] dark:text-[#f0d59d]",
      icon: CalendarClock,
      label: "Pendentes",
      value: countByStatus(appointments, "scheduled"),
    },
    {
      className: "text-[#8a4545] dark:text-[#efb5b5]",
      icon: CalendarX2,
      label: "Cancelados",
      value: countByStatus(appointments, "canceled"),
    },
  ];

  return (
    <section
      aria-label="Resumo dos agendamentos filtrados"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {counters.map((counter) => {
        const Icon = counter.icon;

        return (
          <div
            key={counter.label}
            className="rounded-[1.5rem] border border-[#eadfd3] bg-white/[0.78] px-4 py-4 shadow-[0_12px_34px_rgba(48,37,28,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(48,37,28,0.1)] dark:border-white/10 dark:bg-card/[0.78] dark:hover:bg-card"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8a7a] dark:text-muted-foreground">
                {counter.label}
              </p>
              <Icon
                className={cn("size-5 shrink-0", counter.className)}
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-3xl font-semibold leading-none text-[#211b18] dark:text-foreground">
              {counter.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
