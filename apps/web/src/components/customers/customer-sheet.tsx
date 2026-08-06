"use client";

import { CustomerForm } from "@/components/customers/customer-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Customer, CustomerFormValues } from "@/types/customer";

type CustomerSheetProps = Readonly<{
  actionError?: string;
  customer?: Customer;
  initialValues?: CustomerFormValues;
  isOpen: boolean;
  mode?: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
  onSubmitCustomer: (values: CustomerFormValues) => Promise<boolean>;
}>;

export function CustomerSheet({
  actionError,
  customer,
  initialValues,
  isOpen,
  mode = "create",
  onOpenChange,
  onSubmitCustomer,
}: CustomerSheetProps) {
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
              {isEditMode ? "Editar Cliente" : "Novo Cliente"}
            </SheetTitle>
            <SheetDescription className="text-[#74675d] dark:text-muted-foreground">
              {isEditMode
                ? `Atualize os dados de ${customer?.name ?? "cliente selecionado"}.`
                : "Cadastre um cliente para manter contato e historico em ordem."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <CustomerForm
          actionError={actionError}
          initialValues={initialValues}
          isOpen={isOpen}
          submitLabel={isEditMode ? "Salvar Alteracoes" : "Salvar Cliente"}
          onCancel={() => onOpenChange(false)}
          onSubmitCustomer={onSubmitCustomer}
        />
      </SheetContent>
    </Sheet>
  );
}
