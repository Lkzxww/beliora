import { UserPlus } from "lucide-react";

import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";

type CustomerHeaderProps = Readonly<{
  onCreateCustomer?: () => void;
}>;

export function CustomerHeader({ onCreateCustomer }: CustomerHeaderProps) {
  return (
    <PageHeader
      title="Clientes"
      description="Organize perfis, contatos e historico de relacionamento."
      actions={
        <Button
          type="button"
          onClick={onCreateCustomer}
          className="h-12 w-full rounded-2xl bg-[#7a2638] px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(122,38,56,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#681f30] hover:shadow-[0_20px_44px_rgba(122,38,56,0.28)] active:translate-y-px sm:w-auto dark:bg-[#9f3a50] dark:hover:bg-[#b0455d]"
        >
          <UserPlus className="size-[1.125rem]" aria-hidden="true" />
          Novo Cliente
        </Button>
      }
    />
  );
}
