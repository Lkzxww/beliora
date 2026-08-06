"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORIES,
  SERVICE_COLOR_OPTIONS,
  SERVICE_DURATION_OPTIONS,
  type ServiceDuration,
  type ServiceFormValues,
} from "@/types/service";

type ServiceFormProps = Readonly<{
  actionError?: string;
  initialValues?: ServiceFormValues;
  isOpen: boolean;
  onCancel: () => void;
  onSubmitService: (values: ServiceFormValues) => Promise<boolean>;
  submitLabel?: string;
}>;

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

const serviceFormSchema = z.object({
  category: z.enum(SERVICE_CATEGORIES, {
    message: "Escolha uma categoria válida.",
  }),
  color: z.enum(SERVICE_COLOR_OPTIONS, {
    message: "Escolha uma cor válida.",
  }),
  description: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional(),
  duration: z.custom<ServiceDuration>(
    (value) => typeof value === "number" && isServiceDuration(value),
    "Escolha uma duração válida.",
  ),
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do serviço.")
    .max(120, "Use no máximo 120 caracteres."),
  price: z
    .string()
    .trim()
    .refine(isValidPrice, "Informe um preço válido."),
}) satisfies z.ZodType<ServiceFormValues>;

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

export function ServiceForm({
  actionError,
  initialValues,
  isOpen,
  onCancel,
  onSubmitService,
  submitLabel = "Salvar Serviço",
}: ServiceFormProps) {
  const defaultValues: ServiceFormValues = useMemo(
    () =>
      initialValues ?? {
        category: "Feminino",
        color: SERVICE_COLOR_OPTIONS[0],
        description: "",
        duration: 60,
        name: "",
        price: "",
      },
    [initialValues],
  );
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ServiceFormValues>({
    defaultValues,
    resolver: zodResolver(serviceFormSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, isOpen, reset]);

  async function submitForm(values: ServiceFormValues) {
    const wasSuccessful = await onSubmitService(values);

    if (wasSuccessful) {
      reset(defaultValues);
    }
  }

  function cancelForm() {
    reset(defaultValues);
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {actionError ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#e8c7cf] bg-[#faedf0] px-4 py-3 text-sm font-semibold leading-6 text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]"
          >
            {actionError}
          </div>
        ) : null}

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Nome</span>
          <Input
            {...register("name")}
            className={cn(fieldClassName, errors.name && "border-[#9f2f45]")}
            placeholder="Nome do serviço"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name?.message} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Categoria</span>
            <select
              {...register("category")}
              className={selectClassName}
              aria-invalid={Boolean(errors.category)}
            >
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </label>

          <label className="space-y-2.5">
            <span className={fieldLabelClassName}>Duração</span>
            <select
              {...register("duration", { valueAsNumber: true })}
              className={selectClassName}
              aria-invalid={Boolean(errors.duration)}
            >
              {SERVICE_DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} min
                </option>
              ))}
            </select>
            <FieldError message={errors.duration?.message} />
          </label>
        </div>

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Preço</span>
          <Input
            {...register("price")}
            className={cn(fieldClassName, errors.price && "border-[#9f2f45]")}
            inputMode="decimal"
            placeholder="120.00"
            aria-invalid={Boolean(errors.price)}
          />
          <FieldError message={errors.price?.message} />
        </label>

        <fieldset className="space-y-2.5">
          <legend className={fieldLabelClassName}>Cor</legend>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {SERVICE_COLOR_OPTIONS.map((color) => (
              <label
                key={color}
                className={cn(
                  "grid size-11 cursor-pointer place-items-center rounded-2xl border border-[#e2d6c8] bg-white/75 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-within:ring-3 focus-within:ring-[#c9a76a]/30 has-[:checked]:border-[#c9a76a] has-[:checked]:shadow-[0_12px_26px_rgba(122,38,56,0.15)] dark:border-white/10 dark:bg-white/5",
                )}
              >
                <input
                  {...register("color")}
                  type="radio"
                  value={color}
                  className="sr-only"
                />
                <span
                  className="size-5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="sr-only">{color}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.color?.message} />
        </fieldset>

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Descrição</span>
          <textarea
            {...register("description")}
            className={cn(
              textAreaClassName,
              errors.description && "border-[#9f2f45]",
            )}
            placeholder="Contexto, preparo ou observações importantes"
            aria-invalid={Boolean(errors.description)}
          />
          <FieldError message={errors.description?.message} />
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
