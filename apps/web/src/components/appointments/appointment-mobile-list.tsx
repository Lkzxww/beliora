import { CalendarX } from "lucide-react";

import { AppointmentCard } from "@/components/appointments/appointment-card";
import {
  sortAppointmentsByTime,
  type CurrentTimeMarker,
} from "@/components/appointments/appointment-calendar-utils";
import { EmptyState } from "@/components/shared";
import type { Appointment, AppointmentWeekDay } from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentMobileListProps = Readonly<{
  appointments: Appointment[];
  currentTimeMarker?: CurrentTimeMarker;
  onSelectAppointment?: (appointment: Appointment) => void;
  selectedAppointmentId?: string;
  weekDays: AppointmentWeekDay[];
}>;

export function AppointmentMobileList({
  appointments,
  currentTimeMarker,
  onSelectAppointment,
  selectedAppointmentId,
  weekDays,
}: AppointmentMobileListProps) {
  if (appointments.length === 0) {
    return (
      <div className="md:hidden">
        <EmptyState
          icon={<CalendarX className="size-5" aria-hidden="true" />}
          title="Nenhum atendimento"
          description="A lista mobile mostrará os atendimentos da semana assim que existirem horários marcados."
        />
      </div>
    );
  }

  return (
    <section className="space-y-5 md:hidden">
      {weekDays.map((day) => {
        const dayAppointments = sortAppointmentsByTime(
          appointments.filter(
            (appointment) => appointment.isoDate === day.isoDate,
          ),
        );
        const shouldShowCurrentTime =
          currentTimeMarker?.isoDate === day.isoDate;

        if (dayAppointments.length === 0 && !shouldShowCurrentTime) {
          return null;
        }

        return (
          <div
            key={day.isoDate}
            className="rounded-[1.75rem] border border-[#eadfd3] bg-white/[0.82] p-4 shadow-[0_14px_34px_rgba(48,37,28,0.07)] dark:border-white/10 dark:bg-card/[0.88]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a8a7a] dark:text-muted-foreground">
                  {day.shortLabel.toUpperCase()}
                </p>
                <h2 className="mt-1 text-2xl font-semibold leading-none text-[#211b18] dark:text-foreground">
                  {day.dayNumber}
                </h2>
              </div>
              {day.isToday ? (
                <span className="rounded-full bg-[#7a2638] px-2.5 py-1 text-[0.68rem] font-semibold text-white shadow-sm">
                  Hoje
                </span>
              ) : null}
            </div>

            <div className="relative space-y-3">
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-[4.75rem] top-3 w-px bg-[#ead9c4] dark:bg-white/10"
              />

              {shouldShowCurrentTime && currentTimeMarker ? (
                <div className="relative grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3">
                  <p className="pt-0.5 text-right text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#c53636]">
                    Agora
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="relative z-10 size-2.5 rounded-full bg-[#c53636] shadow-[0_0_0_4px_rgba(197,54,54,0.12)]" />
                    <span className="h-px flex-1 bg-[#c53636]" />
                    <span className="rounded-full bg-[#c53636] px-2 py-0.5 text-[0.65rem] font-semibold text-white shadow-sm">
                      {currentTimeMarker.timeLabel}
                    </span>
                  </div>
                </div>
              ) : null}

              {dayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="relative grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3"
                >
                  <div className="pt-4 text-right">
                    <p className="whitespace-nowrap text-xs font-bold text-[#7a2638] dark:text-[#f0bcc8]">
                      {appointment.startTime}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-[0.68rem] font-medium text-[#9a8a7a] dark:text-muted-foreground">
                      {appointment.endTime}
                    </p>
                  </div>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-[1.03rem] top-5 z-10 size-2.5 rounded-full border-2 border-[#fffaf4] bg-[#c9a76a] shadow-sm dark:border-[#1b1714]",
                        appointment.id === selectedAppointmentId &&
                          "bg-[#7a2638]",
                      )}
                    />
                    <AppointmentCard
                      appointment={appointment}
                      isSelected={appointment.id === selectedAppointmentId}
                      onSelectAppointment={onSelectAppointment}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
