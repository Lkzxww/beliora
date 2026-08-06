"use client";

import {
  AppointmentForm,
  type NewAppointmentFormValues,
} from "@/components/appointments/appointment-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  Appointment,
  AppointmentCustomerOption,
  AppointmentProfessional,
  AppointmentService,
  AppointmentWeekDay,
} from "@/types/appointment";

type AppointmentNewSheetProps = Readonly<{
  actionError?: string;
  appointment?: Appointment;
  customers: AppointmentCustomerOption[];
  initialValues?: NewAppointmentFormValues;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmitAppointment: (values: NewAppointmentFormValues) => Promise<boolean>;
  mode?: "create" | "edit";
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  weekDays: AppointmentWeekDay[];
}>;

export function AppointmentNewSheet({
  actionError,
  appointment,
  customers,
  initialValues,
  isOpen,
  mode = "create",
  onOpenChange,
  onSubmitAppointment,
  professionals,
  services,
  weekDays,
}: AppointmentNewSheetProps) {
  const isEditMode = mode === "edit";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden border-[#eadfd3] bg-[#f7f2eb] p-0 text-[#211d1b] dark:border-white/10 dark:bg-[#11100f] sm:max-w-xl"
      >
        <div className="border-b border-[#efe4d8] bg-[#fffbf5]/90 px-6 py-6 pr-14 dark:border-white/10 dark:bg-white/[0.03]">
          <SheetHeader>
            <SheetTitle className="text-2xl text-[#211b18] dark:text-foreground">
              {isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
            </SheetTitle>
            <SheetDescription className="text-[#74675d] dark:text-muted-foreground">
              {isEditMode
                ? `Atualize os dados do atendimento de ${appointment?.customer.name ?? "cliente selecionado"}.`
                : "Preencha os dados do atendimento para adicioná-lo à agenda."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <AppointmentForm
          actionError={actionError}
          customers={customers}
          initialValues={initialValues}
          isOpen={isOpen}
          professionals={professionals}
          services={services}
          submitLabel={
            isEditMode ? "Salvar Alterações" : "Salvar Agendamento"
          }
          weekDays={weekDays}
          onCancel={() => onOpenChange(false)}
          onSubmitAppointment={onSubmitAppointment}
        />
      </SheetContent>
    </Sheet>
  );
}
