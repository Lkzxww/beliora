import { CalendarX } from "lucide-react";

import { AppointmentCard } from "@/components/appointments/appointment-card";
import { EmptyState } from "@/components/shared";
import type { Appointment, AppointmentWeekDay } from "@/types/appointment";

type AppointmentMobileListProps = Readonly<{
  appointments: Appointment[];
  onSelectAppointment?: (appointment: Appointment) => void;
  selectedAppointmentId?: string;
  weekDays: AppointmentWeekDay[];
}>;

export function AppointmentMobileList({
  appointments,
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
        const dayAppointments = appointments.filter(
          (appointment) => appointment.isoDate === day.isoDate,
        );

        if (dayAppointments.length === 0) {
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

            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={appointment.id === selectedAppointmentId}
                  onSelectAppointment={onSelectAppointment}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
