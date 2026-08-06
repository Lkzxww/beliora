"use client";

import {
  Archive,
  CalendarDays,
  Edit3,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";
import { cn } from "@/lib/utils";

type CustomerDetailsProps = Readonly<{
  archiveError?: string;
  customer?: Customer;
  isArchivePending?: boolean;
  onArchiveCustomer?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
}>;

type CustomerDetailItemProps = Readonly<{
  icon: typeof UserRound;
  label: string;
  value: string;
}>;

function formatIsoDateLabel(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function CustomerDetailItem({
  icon: Icon,
  label,
  value,
}: CustomerDetailItemProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd3] bg-[#fffbf5]/70 p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8a7a] dark:text-muted-foreground">
        <Icon className="size-4 text-[#8a6426] dark:text-[#f0d59d]" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#211b18] dark:text-foreground">
        {value}
      </p>
    </div>
  );
}

export function CustomerDetails({
  archiveError,
  customer,
  isArchivePending = false,
  onArchiveCustomer,
  onEditCustomer,
}: CustomerDetailsProps) {
  if (!customer) {
    return (
      <EmptyState
        icon={<UserRound className="size-5" aria-hidden="true" />}
        title="Nenhum cliente selecionado"
        description="Selecione um cliente na lista para visualizar o perfil."
        className="h-full min-h-[28rem] rounded-[1.75rem] bg-white/[0.72] dark:bg-card/[0.72]"
      />
    );
  }

  const isArchived = customer.status === "archived";

  return (
    <aside className="rounded-[1.75rem] border border-[#eadfd3] bg-white/[0.82] p-5 shadow-[0_18px_50px_rgba(48,37,28,0.08)] dark:border-white/10 dark:bg-card/[0.88]">
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-[#d8c8b6] bg-[#241b17] text-base font-semibold text-[#f6ead9] shadow-[0_12px_24px_rgba(36,27,23,0.14)] dark:border-white/10">
          {customer.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a6426] dark:text-[#f0d59d]">
                Perfil do cliente
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#211b18] dark:text-foreground">
                {customer.name}
              </h2>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 border border-[#d2b675]/30 bg-[#f3e7d4] text-[#2b211b]",
                isArchived &&
                  "border-[#e8c7cf] bg-[#faedf0] text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]",
              )}
            >
              {isArchived ? "Arquivado" : "Ativo"}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#74675d] dark:text-muted-foreground">
            Cliente desde {formatIsoDateLabel(customer.createdAt)}
          </p>
        </div>
      </div>

      {archiveError ? (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-[#e8c7cf] bg-[#faedf0] px-4 py-3 text-sm font-semibold leading-6 text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]"
        >
          {archiveError}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        <CustomerDetailItem icon={Phone} label="Telefone" value={customer.phone} />
        <CustomerDetailItem
          icon={Mail}
          label="E-mail"
          value={customer.email ?? "Nao informado"}
        />
        <CustomerDetailItem
          icon={CalendarDays}
          label="Atendimentos"
          value={`${customer.appointmentCount} no historico`}
        />
        <CustomerDetailItem
          icon={CalendarDays}
          label="Proximos horarios"
          value={`${customer.upcomingAppointmentCount} agendamentos`}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onEditCustomer?.(customer)}
          className="h-12 rounded-2xl border-[#e2d6c8] bg-white/75 text-sm font-semibold text-[#423832] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#7a2638] active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
        >
          <Edit3 className="size-4" aria-hidden="true" />
          Editar
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isArchived || isArchivePending}
          onClick={() => onArchiveCustomer?.(customer)}
          className="h-12 rounded-2xl border-[#e8c7cf] bg-[#fff7f8] text-sm font-semibold text-[#8b3348] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faedf0] active:translate-y-px disabled:translate-y-0 dark:border-[#f0bcc8]/20 dark:bg-[#7a2638]/[0.12] dark:text-[#f0bcc8] dark:hover:bg-[#7a2638]/[0.18]"
        >
          <Archive className="size-4" aria-hidden="true" />
          {isArchivePending ? "Arquivando..." : "Arquivar"}
        </Button>
      </div>
    </aside>
  );
}
