"use client";

import { ServiceForm } from "@/components/services/service-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Service, ServiceFormValues } from "@/types/service";

type ServiceSheetProps = Readonly<{
  actionError?: string;
  initialValues?: ServiceFormValues;
  isOpen: boolean;
  mode?: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
  onSubmitService: (values: ServiceFormValues) => Promise<boolean>;
  service?: Service;
}>;

export function ServiceSheet({
  actionError,
  initialValues,
  isOpen,
  mode = "create",
  onOpenChange,
  onSubmitService,
  service,
}: ServiceSheetProps) {
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
              {isEditMode ? "Editar Serviço" : "Novo Serviço"}
            </SheetTitle>
            <SheetDescription className="text-[#74675d] dark:text-muted-foreground">
              {isEditMode
                ? `Atualize os dados de ${service?.name ?? "serviço selecionado"}.`
                : "Cadastre um serviço com preço, duração e identidade visual."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <ServiceForm
          actionError={actionError}
          initialValues={initialValues}
          isOpen={isOpen}
          submitLabel={isEditMode ? "Salvar Alterações" : "Salvar Serviço"}
          onCancel={() => onOpenChange(false)}
          onSubmitService={onSubmitService}
        />
      </SheetContent>
    </Sheet>
  );
}
