"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AppointmentProfessional,
  AppointmentService,
  AppointmentWeekDay,
} from "@/types/appointment";
import { cn } from "@/lib/utils";

type AppointmentFormProps = Readonly<{
  initialValues?: NewAppointmentFormValues;
  isOpen: boolean;
  onCancel: () => void;
  onSubmitAppointment: (values: NewAppointmentFormValues) => Promise<void>;
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  submitLabel?: string;
  weekDays: AppointmentWeekDay[];
}>;

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function timeToMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function createAppointmentFormSchema({
  professionalIds,
  serviceIds,
  weekDates,
}: {
  professionalIds: string[];
  serviceIds: string[];
  weekDates: string[];
}) {
  return z
    .object({
      customerName: z.string().trim().min(1, "Informe o cliente."),
      professionalId: z.string().trim().min(1, "Escolha um profissional."),
      serviceId: z.string().trim().min(1, "Escolha um serviço."),
      isoDate: z.string().trim().min(1, "Escolha uma data."),
      startTime: z
        .string()
        .trim()
        .min(1, "Informe o horário inicial.")
        .regex(timePattern, "Use o formato HH:mm."),
      endTime: z
        .string()
        .trim()
        .min(1, "Informe o horário final.")
        .regex(timePattern, "Use o formato HH:mm."),
      notes: z.string().trim().min(1, "Adicione uma observação."),
    })
    .superRefine((values, context) => {
      if (!professionalIds.includes(values.professionalId)) {
        context.addIssue({
          code: "custom",
          message: "Escolha um profissional válido.",
          path: ["professionalId"],
        });
      }

      if (!serviceIds.includes(values.serviceId)) {
        context.addIssue({
          code: "custom",
          message: "Escolha um serviço válido.",
          path: ["serviceId"],
        });
      }

      if (!weekDates.includes(values.isoDate)) {
        context.addIssue({
          code: "custom",
          message: "Escolha uma data da semana exibida.",
          path: ["isoDate"],
        });
      }

      if (
        timePattern.test(values.startTime) &&
        timePattern.test(values.endTime) &&
        timeToMinutes(values.endTime) <= timeToMinutes(values.startTime)
      ) {
        context.addIssue({
          code: "custom",
          message: "O horário final precisa ser posterior ao horário inicial.",
          path: ["endTime"],
        });
      }
    });
}

export type NewAppointmentFormValues = z.infer<
  ReturnType<typeof createAppointmentFormSchema>
>;

function FieldError({ message }: Readonly<{ message?: string }>) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-xs font-medium text-[#9f2f45] dark:text-[#f0bcc8]">
      {message}
    </p>
  );
}

const fieldLabelClassName =
  "text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a6426] dark:text-[#f0d59d]";

const fieldClassName =
  "h-12 rounded-2xl border-[#e2d6c8] bg-white/85 px-4 text-sm font-medium text-[#2b2622] shadow-sm transition-all duration-200 placeholder:text-[#9b8f84] hover:bg-white focus-visible:border-[#c9a76a] dark:border-white/10 dark:bg-white/5 dark:text-foreground";

const selectClassName =
  "h-12 w-full rounded-2xl border border-[#e2d6c8] bg-white/85 px-4 text-sm font-medium text-[#2b2622] shadow-sm outline-none transition-all duration-200 hover:bg-white focus:border-[#c9a76a] focus:ring-3 focus:ring-[#c9a76a]/30 dark:border-white/10 dark:bg-white/5 dark:text-foreground";

const textAreaClassName =
  "min-h-28 w-full resize-none rounded-2xl border border-[#e2d6c8] bg-white/85 px-4 py-3 text-sm font-medium leading-6 text-[#2b2622] shadow-sm outline-none transition-all duration-200 placeholder:text-[#9b8f84] hover:bg-white focus:border-[#c9a76a] focus:ring-3 focus:ring-[#c9a76a]/30 dark:border-white/10 dark:bg-white/5 dark:text-foreground";

export function AppointmentForm({
  initialValues,
  isOpen,
  onCancel,
  onSubmitAppointment,
  professionals,
  services,
  submitLabel = "Salvar Agendamento",
  weekDays,
}: AppointmentFormProps) {
  const today = weekDays.find((day) => day.isToday) ?? weekDays[0];
  const schema = useMemo(
    () =>
      createAppointmentFormSchema({
        professionalIds: professionals.map((professional) => professional.id),
        serviceIds: services.map((service) => service.id),
        weekDates: weekDays.map((day) => day.isoDate),
      }),
    [professionals, services, weekDays],
  );
  const defaultValues: NewAppointmentFormValues = useMemo(
    () =>
      initialValues ?? {
        customerName: "",
        professionalId: professionals[0]?.id ?? "",
        serviceId: services[0]?.id ?? "",
        isoDate: today?.isoDate ?? "",
        startTime: "09:00",
        endTime: "10:00",
        notes: "",
      },
    [initialValues, professionals, services, today?.isoDate],
  );
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<NewAppointmentFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, isOpen, reset]);

  async function submitForm(values: NewAppointmentFormValues) {
    await onSubmitAppointment(values);
    reset(defaultValues);
  }

  function cancelForm() {
    reset(defaultValues);
    onCancel();
  }

  const timeRangeError =
    errors.endTime?.type === "custom" ? errors.endTime.message : undefined;
  const endTimeFieldError =
    errors.endTime?.type === "custom" ? undefined : errors.endTime?.message;

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Cliente</span>
          <Input
            {...register("customerName")}
            className={fieldClassName}
            placeholder="Nome da cliente"
            aria-invalid={Boolean(errors.customerName)}
          />
          <FieldError message={errors.customerName?.message} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Profissional</span>
            <select
              {...register("professionalId")}
              className={selectClassName}
              aria-invalid={Boolean(errors.professionalId)}
            >
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.professionalId?.message} />
          </label>

          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Serviço</span>
            <select
              {...register("serviceId")}
              className={selectClassName}
              aria-invalid={Boolean(errors.serviceId)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.serviceId?.message} />
          </label>
        </div>

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Data</span>
          <Input
            {...register("isoDate")}
            className={fieldClassName}
            min={weekDays[0]?.isoDate}
            max={weekDays.at(-1)?.isoDate}
            type="date"
            aria-invalid={Boolean(errors.isoDate)}
          />
          <FieldError message={errors.isoDate?.message} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Horário Inicial</span>
            <Input
              {...register("startTime")}
              className={cn(fieldClassName, timeRangeError && "border-[#9f2f45]")}
              type="time"
              aria-invalid={Boolean(errors.startTime || timeRangeError)}
            />
            <FieldError message={errors.startTime?.message} />
          </label>

          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Horário Final</span>
            <Input
              {...register("endTime")}
              className={cn(fieldClassName, timeRangeError && "border-[#9f2f45]")}
              type="time"
              aria-invalid={Boolean(errors.endTime)}
            />
            <FieldError message={endTimeFieldError} />
          </label>
        </div>
        <FieldError message={timeRangeError} />

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Observações</span>
          <textarea
            {...register("notes")}
            className={cn(textAreaClassName, errors.notes && "border-[#9f2f45]")}
            placeholder="Preferências, cuidados ou contexto do atendimento"
            aria-invalid={Boolean(errors.notes)}
          />
          <FieldError message={errors.notes?.message} />
        </label>
      </div>

      <div className="border-t border-[#efe4d8] bg-[#fffbf5]/90 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={cancelForm}
            className="h-12 rounded-2xl border-[#e2d6c8] bg-white/75 text-sm font-semibold text-[#423832] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-2xl bg-[#7a2638] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(122,38,56,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] active:translate-y-px disabled:translate-y-0 dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
