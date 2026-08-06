import { z } from "zod";

import {
  appointmentTimePattern,
  isEndTimeAfterStartTime,
} from "@/lib/appointment-time";
import type { AppointmentFormValues } from "@/types/appointment";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

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
      .regex(appointmentTimePattern, "Informe um horário inicial válido."),
    endTime: z
      .string()
      .trim()
      .regex(appointmentTimePattern, "Informe um horário final válido."),
    notes: z.string().trim().min(1, "Adicione uma observação.").max(500),
  })
  .superRefine((values, context) => {
    if (
      appointmentTimePattern.test(values.startTime) &&
      appointmentTimePattern.test(values.endTime) &&
      !isEndTimeAfterStartTime({
        endTime: values.endTime,
        startTime: values.startTime,
      })
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
