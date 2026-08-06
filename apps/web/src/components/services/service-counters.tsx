import { Archive, Clock3, DollarSign, Scissors, Sparkles } from "lucide-react";

import { MetricCard } from "@/components/shared";
import type {
  Service,
  ServiceCounters as ServiceCounterValues,
} from "@/types/service";

type ServiceCountersProps = Readonly<{
  services: Service[];
}>;

function formatAveragePrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

function getServiceCounters(services: Service[]): ServiceCounterValues {
  const activeServices = services.filter((service) => service.status === "active");
  const averagePrice =
    activeServices.length > 0
      ? activeServices.reduce(
          (total, service) => total + Number(service.price),
          0,
        ) / activeServices.length
      : 0;
  const averageDuration =
    activeServices.length > 0
      ? activeServices.reduce((total, service) => total + service.duration, 0) /
        activeServices.length
      : 0;

  return {
    active: activeServices.length,
    archived: services.filter((service) => service.status === "archived")
      .length,
    averageDurationLabel: `${Math.round(averageDuration)} min`,
    averagePriceLabel: formatAveragePrice(averagePrice),
    total: services.length,
  };
}

export function ServiceCounters({ services }: ServiceCountersProps) {
  const counters = getServiceCounters(services);

  return (
    <section
      aria-label="Resumo dos serviços filtrados"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
    >
      <MetricCard
        icon={Scissors}
        iconClassName="text-[#7a2638] dark:text-[#f0bcc8]"
        label="Total"
        value={counters.total}
      />
      <MetricCard
        icon={Sparkles}
        iconClassName="text-[#52745e] dark:text-[#a8d6b3]"
        label="Ativos"
        value={counters.active}
      />
      <MetricCard
        icon={Archive}
        iconClassName="text-[#8a4545] dark:text-[#efb5b5]"
        label="Arquivados"
        value={counters.archived}
      />
      <MetricCard
        icon={DollarSign}
        iconClassName="text-[#9a6b21] dark:text-[#f0d59d]"
        label="Preço médio"
        value={counters.averagePriceLabel}
      />
      <MetricCard
        icon={Clock3}
        iconClassName="text-[#354052] dark:text-[#c4d0e5]"
        label="Tempo médio"
        value={counters.averageDurationLabel}
      />
    </section>
  );
}
