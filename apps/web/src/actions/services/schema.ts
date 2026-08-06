import { z } from "zod";

import {
  SERVICE_CATEGORIES,
  SERVICE_COLOR_OPTIONS,
  SERVICE_DURATION_OPTIONS,
  type ServiceFormValues,
  type ServiceDuration,
} from "@/types/service";

function normalizePrice(value: string) {
  return value.trim().replace(",", ".");
}

function isValidPrice(value: string) {
  const normalizedPrice = normalizePrice(value);
  const parsedPrice = Number(normalizedPrice);

  return (
    normalizedPrice.length > 0 &&
    Number.isFinite(parsedPrice) &&
    parsedPrice >= 0
  );
}

function isServiceDuration(value: number): value is ServiceDuration {
  return SERVICE_DURATION_OPTIONS.some((duration) => duration === value);
}

export const serviceActionSchema = z.object({
  category: z.enum(SERVICE_CATEGORIES, {
    message: "Escolha uma categoria valida.",
  }),
  color: z.enum(SERVICE_COLOR_OPTIONS, {
    message: "Escolha uma cor valida.",
  }),
  description: z.string().trim().max(500, "Use no maximo 500 caracteres.").optional(),
  duration: z.custom<ServiceDuration>(
    (value) => typeof value === "number" && isServiceDuration(value),
    "Escolha uma duracao valida.",
  ),
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do servico.")
    .max(120, "Use no maximo 120 caracteres."),
  price: z
    .string()
    .trim()
    .refine(isValidPrice, "Informe um preco valido."),
}) satisfies z.ZodType<ServiceFormValues>;

export const serviceIdSchema = z
  .string()
  .trim()
  .min(1, "Informe um servico valido.");

export const updateServiceActionSchema = z.object({
  serviceId: serviceIdSchema,
  values: serviceActionSchema,
});

export type ServiceActionInput = z.infer<typeof serviceActionSchema>;
export type UpdateServiceActionInput = z.infer<
  typeof updateServiceActionSchema
>;
