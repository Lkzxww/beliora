import { CalendarClock, UserCheck, UserRoundX, Users } from "lucide-react";

import { MetricCard } from "@/components/shared";
import type { Customer, CustomerCounters as CustomerCounterValues } from "@/types/customer";

type CustomerCountersProps = Readonly<{
  customers: Customer[];
}>;

function getCustomerCounters(customers: Customer[]): CustomerCounterValues {
  return {
    active: customers.filter((customer) => customer.status === "active").length,
    archived: customers.filter((customer) => customer.status === "archived")
      .length,
    total: customers.length,
    upcomingAppointments: customers.reduce(
      (total, customer) => total + customer.upcomingAppointmentCount,
      0,
    ),
  };
}

export function CustomerCounters({ customers }: CustomerCountersProps) {
  const counters = getCustomerCounters(customers);

  return (
    <section
      aria-label="Resumo dos clientes filtrados"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MetricCard
        icon={Users}
        iconClassName="text-[#7a2638] dark:text-[#f0bcc8]"
        label="Total"
        value={counters.total}
      />
      <MetricCard
        icon={UserCheck}
        iconClassName="text-[#52745e] dark:text-[#a8d6b3]"
        label="Ativos"
        value={counters.active}
      />
      <MetricCard
        icon={CalendarClock}
        iconClassName="text-[#9a6b21] dark:text-[#f0d59d]"
        label="Agendamentos"
        value={counters.upcomingAppointments}
      />
      <MetricCard
        icon={UserRoundX}
        iconClassName="text-[#8a4545] dark:text-[#efb5b5]"
        label="Arquivados"
        value={counters.archived}
      />
    </section>
  );
}
