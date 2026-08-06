"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerFormValues } from "@/types/customer";
import { cn } from "@/lib/utils";

type CustomerFormProps = Readonly<{
  actionError?: string;
  initialValues?: CustomerFormValues;
  isOpen: boolean;
  onCancel: () => void;
  onSubmitCustomer: (values: CustomerFormValues) => Promise<boolean>;
  submitLabel?: string;
}>;

const optionalEmailSchema = z
  .string()
  .trim()
  .email("Informe um e-mail valido.")
  .optional()
  .or(z.literal(""));

const customerFormSchema = z.object({
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

export function CustomerForm({
  actionError,
  initialValues,
  isOpen,
  onCancel,
  onSubmitCustomer,
  submitLabel = "Salvar Cliente",
}: CustomerFormProps) {
  const defaultValues: CustomerFormValues = useMemo(
    () =>
      initialValues ?? {
        email: "",
        name: "",
        phone: "",
      },
    [initialValues],
  );
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CustomerFormValues>({
    defaultValues,
    resolver: zodResolver(customerFormSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, isOpen, reset]);

  async function submitForm(values: CustomerFormValues) {
    const wasSuccessful = await onSubmitCustomer(values);

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
            placeholder="Nome completo"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name?.message} />
        </label>

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>Telefone</span>
          <Input
            {...register("phone")}
            className={cn(fieldClassName, errors.phone && "border-[#9f2f45]")}
            placeholder="(11) 90000-0000"
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone?.message} />
        </label>

        <label className="space-y-2.5">
          <span className={fieldLabelClassName}>E-mail</span>
          <Input
            {...register("email")}
            className={cn(fieldClassName, errors.email && "border-[#9f2f45]")}
            placeholder="cliente@email.com"
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email?.message} />
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
