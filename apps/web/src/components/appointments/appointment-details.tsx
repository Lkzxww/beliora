import {
  CalendarClock,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";

import { AppointmentStatusBadge } from "@/components/appointments/appointment-status";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Appointment } from "@/types/appointment";

type AppointmentDetailsProps = Readonly<{
  appointment?: Appointment;
  onCancelAppointment?: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
}>;

export function AppointmentDetails({
  appointment,
  onCancelAppointment,
  onEditAppointment,
}: AppointmentDetailsProps) {
  if (!appointment) {
    return (
      <Card className="rounded-[2rem] bg-white/[0.88] shadow-[0_18px_50px_rgba(48,37,28,0.08)] ring-[#eadfd3] dark:bg-card/[0.92] dark:ring-white/10">
        <CardContent className="py-8">
          <p className="text-center text-sm text-[#74675d] dark:text-muted-foreground">
            Selecione um atendimento para ver os detalhes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const details = [
    {
      icon: CalendarClock,
      label: "Data",
      value: appointment.dayLabel,
    },
    {
      icon: Clock,
      label: "Horário",
      value: `${appointment.startTime} — ${appointment.endTime}`,
    },
    {
      icon: Scissors,
      label: "Serviço",
      value: appointment.service.name,
    },
    {
      icon: UserRound,
      label: "Profissional",
      value: appointment.professional.name,
    },
    {
      icon: MapPin,
      label: "Local",
      value: appointment.room,
    },
    {
      icon: CreditCard,
      label: "Pagamento",
      value: appointment.paymentStatus,
    },
  ] as const;

  return (
    <aside className="xl:sticky xl:top-28">
      <Card className="rounded-[2rem] bg-white/[0.88] shadow-[0_18px_50px_rgba(48,37,28,0.08)] ring-[#eadfd3] dark:bg-card/[0.92] dark:ring-white/10">
        <CardHeader className="border-b border-[#efe4d8] pb-5 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a6426] dark:text-[#f0d59d]">
                Atendimento
              </p>
              <CardTitle className="mt-2 truncate text-2xl font-semibold text-[#211b18] dark:text-foreground">
                {appointment.customer.name}
              </CardTitle>
            </div>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 rounded-[1.35rem] border border-[#ead9c4] bg-[#fffaf4] p-4 dark:border-white/10 dark:bg-white/[0.035]">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#241b17] text-sm font-semibold text-[#f6ead9] shadow-[0_12px_24px_rgba(36,27,23,0.16)]">
              {appointment.customer.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#211b18] dark:text-foreground">
                {appointment.customer.name}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#74675d] dark:text-muted-foreground">
                <Phone
                  className="size-3.5 text-[#a79a8e]"
                  aria-hidden="true"
                />
                {appointment.customer.phone}
              </p>
            </div>
          </div>

          <dl className="space-y-2.5">
            {details.map((detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="grid grid-cols-[minmax(5.75rem,0.75fr)_minmax(0,1.25fr)] gap-3 rounded-2xl border border-transparent px-1 py-2.5 transition-colors duration-200 hover:border-[#efe4d8] hover:bg-[#fffaf4] dark:hover:border-white/10 dark:hover:bg-white/[0.035]"
                >
                  <dt className="flex items-center gap-2 text-xs font-medium text-[#9a8a7a] dark:text-muted-foreground">
                    <Icon
                      className="size-3.5 text-[#b5a797]"
                      aria-hidden="true"
                    />
                    {detail.label}
                  </dt>
                  <dd className="min-w-0 text-sm font-semibold leading-5 text-[#211b18] dark:text-foreground">
                    {detail.value}
                  </dd>
                </div>
              );
            })}
          </dl>

          {appointment.notes ? (
            <div className="rounded-[1.35rem] border border-[#dfcaa9] bg-[#f8eedf] p-4 dark:border-[#c9a76a]/25 dark:bg-[#c9a76a]/10">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8a6426] dark:text-[#f0d59d]">
                Observações
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6f6258] dark:text-muted-foreground">
                {appointment.notes}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Button
              type="button"
              onClick={() => onEditAppointment?.(appointment)}
              className="h-11 rounded-2xl bg-[#7a2638] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] active:translate-y-px dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]"
            >
              Editar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancelAppointment?.(appointment)}
              disabled={appointment.status === "canceled"}
              className="h-11 rounded-2xl border-[#e2d6c8] bg-white/70 text-sm font-semibold text-[#7a2638] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8c2a8] hover:bg-white active:translate-y-px disabled:translate-y-0 dark:border-white/10 dark:bg-white/5 dark:text-[#f0bcc8] dark:hover:bg-white/10"
            >
              {appointment.status === "canceled"
                ? "Agendamento cancelado"
                : "Cancelar Agendamento"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
