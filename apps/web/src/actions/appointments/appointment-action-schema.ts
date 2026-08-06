import { z } from "zod";

import type { AppointmentFormValues } from "@/types/appointment";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function timeToMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export const appointmentActionSchema = z
  .object({
    customerId: z.string().trim().min(1, "Escolha um cliente."),
    employeeId: z.string().trim().min(1, "Escolha um profissional."),
    serviceId: z.string().trim().min(1, "Escolha um serviço."),
    isoDate: z
      .string()
      .trim()
      .regex(isoDatePattern, "Escolha uma data válida."),
    startTime: z
      .string()
      .trim()
      .regex(timePattern, "Informe um horário inicial válido."),
    endTime: z
      .string()
      .trim()
      .regex(timePattern, "Informe um horário final válido."),
    notes: z.string().trim().min(1, "Adicione uma observação.").max(500),
  })
  .superRefine((values, context) => {
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
  }) satisfies z.ZodType<AppointmentFormValues>;

export const appointmentIdSchema = z
  .string()
  .trim()
  .min(1, "Informe um agendamento válido.");

export const updateAppointmentActionSchema = z.object({
  appointmentId: appointmentIdSchema,
  values: appointmentActionSchema,
});

export type AppointmentActionInput = z.infer<typeof appointmentActionSchema>;
export type UpdateAppointmentActionInput = z.infer<
  typeof updateAppointmentActionSchema
>;
