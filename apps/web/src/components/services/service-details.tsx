"use client";

import {
  Archive,
  CalendarDays,
  Clock3,
  DollarSign,
  Edit3,
  Layers3,
  Palette,
  Scissors,
} from "lucide-react";

import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";

type ServiceDetailsProps = Readonly<{
  archiveError?: string;
  isArchivePending?: boolean;
  onArchiveService?: (service: Service) => void;
  onEditService?: (service: Service) => void;
  service?: Service;
}>;

type ServiceDetailItemProps = Readonly<{
  icon: typeof Scissors;
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

function ServiceDetailItem({ icon: Icon, label, value }: ServiceDetailItemProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd3] bg-[#fffbf5]/70 p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8a7a] dark:text-muted-foreground">
        <Icon
          className="size-4 text-[#8a6426] dark:text-[#f0d59d]"
          aria-hidden="true"
        />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#211b18] dark:text-foreground">
        {value}
      </p>
    </div>
  );
}

export function ServiceDetails({
  archiveError,
  isArchivePending = false,
  onArchiveService,
  onEditService,
  service,
}: ServiceDetailsProps) {
  if (!service) {
    return (
      <EmptyState
        icon={<Scissors className="size-5" aria-hidden="true" />}
        title="Nenhum serviço selecionado"
        description="Selecione um serviço na lista para visualizar detalhes."
        className="h-full min-h-[28rem] rounded-[1.75rem] bg-white/[0.72] dark:bg-card/[0.72]"
      />
    );
  }

  const isArchived = service.status === "archived";

  return (
    <aside className="rounded-[1.75rem] border border-[#eadfd3] bg-white/[0.82] p-5 shadow-[0_18px_50px_rgba(48,37,28,0.08)] dark:border-white/10 dark:bg-card/[0.88]">
      <div className="flex items-start gap-4">
        <span
          className="mt-2 size-5 shrink-0 rounded-full ring-4 ring-[#f2e6d9] dark:ring-white/10"
          style={{ backgroundColor: service.color }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a6426] dark:text-[#f0d59d]">
                Catálogo
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#211b18] dark:text-foreground">
                {service.name}
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
            Serviço criado em {formatIsoDateLabel(service.createdAt)}
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
        <ServiceDetailItem icon={Layers3} label="Categoria" value={service.category} />
        <ServiceDetailItem icon={Clock3} label="Duração" value={service.durationLabel} />
        <ServiceDetailItem icon={DollarSign} label="Preço" value={service.priceLabel} />
        <ServiceDetailItem icon={Palette} label="Cor" value={service.color} />
        <ServiceDetailItem
          icon={CalendarDays}
          label="Agendamentos"
          value={`${service.appointmentCount} vínculos`}
        />
        <ServiceDetailItem
          icon={Scissors}
          label="Descrição"
          value={service.description ?? "Sem descrição"}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onEditService?.(service)}
          className="h-12 rounded-2xl border-[#e2d6c8] bg-white/75 text-sm font-semibold text-[#423832] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#7a2638] active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
        >
          <Edit3 className="size-4" aria-hidden="true" />
          Editar
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isArchived || isArchivePending}
          onClick={() => onArchiveService?.(service)}
          className="h-12 rounded-2xl border-[#e8c7cf] bg-[#fff7f8] text-sm font-semibold text-[#8b3348] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faedf0] active:translate-y-px disabled:translate-y-0 dark:border-[#f0bcc8]/20 dark:bg-[#7a2638]/[0.12] dark:text-[#f0bcc8] dark:hover:bg-[#7a2638]/[0.18]"
        >
          <Archive className="size-4" aria-hidden="true" />
          {isArchivePending ? "Arquivando..." : "Arquivar"}
        </Button>
      </div>
    </aside>
  );
}
