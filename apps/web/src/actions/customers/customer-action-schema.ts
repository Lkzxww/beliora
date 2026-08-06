import { z } from "zod";

import type { CustomerFormValues } from "@/types/customer";

const optionalEmailSchema = z
  .string()
  .trim()
  .email("Informe um e-mail valido.")
  .optional()
  .or(z.literal(""));

export const customerActionSchema = z.object({
  email: optionalEmailSchema,
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do cliente.")
    .max(120, "Use no maximo 120 caracteres."),
  phone: z
    .string()
    .trim()
    .min(8, "Informe um telefone valido.")
    .max(30, "Use no maximo 30 caracteres."),
}) satisfies z.ZodType<CustomerFormValues>;

export const customerIdSchema = z
  .string()
  .trim()
  .min(1, "Informe um cliente valido.");

export const updateCustomerActionSchema = z.object({
  customerId: customerIdSchema,
  values: customerActionSchema,
});

export type CustomerActionInput = z.infer<typeof customerActionSchema>;
export type UpdateCustomerActionInput = z.infer<
  typeof updateCustomerActionSchema
>;
