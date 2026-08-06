"use client";

import { CalendarX2, Loader2 } from "lucide-react";

import { AppointmentStatusBadge } from "@/components/appointments/appointment-status";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Appointment } from "@/types/appointment";

type AppointmentCancelSheetProps = Readonly<{
  appointment?: Appointment;
  errorMessage?: string;
  isOpen: boolean;
  isPending?: boolean;
  onConfirmCancel: () => Promise<void>;
  onOpenChange: (isOpen: boolean) => void;
}>;

export function AppointmentCancelSheet({
  appointment,
  errorMessage,
  isOpen,
  isPending = false,
  onConfirmCancel,
  onOpenChange,
}: AppointmentCancelSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden border-[#eadfd3] bg-[#f7f2eb] p-0 text-[#211d1b] dark:border-white/10 dark:bg-[#11100f] sm:max-w-md"
      >
        <div className="border-b border-[#efe4d8] bg-[#fffbf5]/90 px-6 py-6 pr-14 dark:border-white/10 dark:bg-white/[0.03]">
          <SheetHeader>
            <SheetTitle className="text-2xl text-[#211b18] dark:text-foreground">
              Cancelar agendamento
            </SheetTitle>
            <SheetDescription className="text-[#74675d] dark:text-muted-foreground">
              Confirme para alterar o status deste atendimento para cancelado.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 px-6 py-5">
          {appointment ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-[1.5rem] border border-[#ead9c4] bg-[#fffaf4] p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#7a2638]/10 text-[#7a2638] dark:bg-[#9f3a50]/15 dark:text-[#f0bcc8]">
                  <CalendarX2 className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-[#211b18] dark:text-foreground">
                      {appointment.customer.name}
                    </p>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#7a2638] dark:text-[#f0bcc8]">
                    {appointment.startTime} — {appointment.endTime}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#74675d] dark:text-muted-foreground">
                    {appointment.dayLabel} · {appointment.service.name} com{" "}
                    {appointment.professional.name}
                  </p>
                </div>
              </div>

              <p className="rounded-[1.25rem] border border-[#dfcaa9] bg-[#f8eedf] px-4 py-3 text-sm leading-6 text-[#6f6258] dark:border-[#c9a76a]/25 dark:bg-[#c9a76a]/10 dark:text-muted-foreground">
                O atendimento continuará aparecendo na agenda, mas será marcado
                como cancelado para preservar o histórico.
              </p>

              {errorMessage ? (
                <p
                  role="alert"
                  className="rounded-[1.25rem] border border-[#e8c7cf] bg-[#faedf0] px-4 py-3 text-sm font-semibold leading-6 text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]"
                >
                  {errorMessage}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-2xl border-[#e2d6c8] bg-white/75 text-sm font-semibold text-[#423832] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={() => {
                void onConfirmCancel();
              }}
              disabled={
                !appointment || appointment.status === "canceled" || isPending
              }
              className="h-12 rounded-2xl bg-[#7a2638] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(122,38,56,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] active:translate-y-px disabled:translate-y-0 dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Confirmar cancelamento
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
