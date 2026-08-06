import { Scissors } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";

type ServiceHeaderProps = Readonly<{
  onCreateService?: () => void;
}>;

export function ServiceHeader({ onCreateService }: ServiceHeaderProps) {
  return (
    <PageHeader
      title="Serviços"
      description="Gerencie o catálogo, preços e duração dos atendimentos."
      actions={
        <Button
          type="button"
          onClick={onCreateService}
          className="h-12 w-full rounded-2xl bg-[#7a2638] px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(122,38,56,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] hover:shadow-[0_20px_44px_rgba(122,38,56,0.28)] active:translate-y-px sm:w-auto dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]"
        >
          <Scissors className="size-[1.125rem]" aria-hidden="true" />
          Novo Serviço
        </Button>
      }
    />
  );
}
