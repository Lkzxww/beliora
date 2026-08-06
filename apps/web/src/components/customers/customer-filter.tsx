"use client";

import { ChevronDown, Filter } from "lucide-react";

import { Search } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { CustomerFilters, CustomerStatus } from "@/types/customer";

type CustomerFilterProps = Readonly<{
  filters: CustomerFilters;
  onFilterChange: (filters: CustomerFilters) => void;
}>;

const selectClassName =
  "h-12 w-full appearance-none rounded-2xl border border-[#e2d6c8] bg-white/80 px-4 pr-11 text-sm font-medium text-[#2b2622] shadow-sm outline-none transition-all duration-200 hover:border-[#d7c6b3] hover:bg-white focus:border-[#c9a76a] focus:ring-3 focus:ring-[#c9a76a]/30 dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10";

const fieldLabelClassName =
  "text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a6426] dark:text-[#f0d59d]";

const statusOptions: Array<{
  label: string;
  value: CustomerStatus | "all";
}> = [
  {
    label: "Todos os clientes",
    value: "all",
  },
  {
    label: "Clientes ativos",
    value: "active",
  },
  {
    label: "Clientes arquivados",
    value: "archived",
  },
];

export function CustomerFilter({
  filters,
  onFilterChange,
}: CustomerFilterProps) {
  function updateFilters(nextFilters: Partial<CustomerFilters>) {
    onFilterChange({
      ...filters,
      ...nextFilters,
    });
  }

  return (
    <section
      aria-label="Filtros de clientes"
      className="overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-white/[0.82] shadow-[0_18px_50px_rgba(48,37,28,0.08)] dark:border-white/10 dark:bg-card/[0.88]"
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-3 bg-[#fffbf5]/60 px-4 py-4 dark:bg-white/[0.025] sm:px-5 md:grid-cols-[minmax(0,1fr)_280px_auto] md:items-end"
      >
        <label className="space-y-2">
          <span className={fieldLabelClassName}>Pesquisar cliente</span>
          <Search
            value={filters.search}
            onValueChange={(value) => updateFilters({ search: value })}
            placeholder="Pesquisar cliente..."
          />
        </label>

        <label className="space-y-2">
          <span className={fieldLabelClassName}>Status</span>
          <span className="relative block">
            <select
              name="status"
              value={filters.status}
              onChange={(event) =>
                updateFilters({
                  status: event.target.value as CustomerStatus | "all",
                })
              }
              className={selectClassName}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </label>

        <Button
          type="submit"
          variant="outline"
          className="h-12 rounded-2xl border-[#e2d6c8] bg-white/75 px-5 text-sm font-semibold text-[#332b26] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d7c6b3] hover:bg-white hover:text-[#7a2638] hover:shadow-[0_14px_30px_rgba(48,37,28,0.08)] active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
        >
          <Filter className="size-4" aria-hidden="true" />
          Filtrar
        </Button>
      </form>
    </section>
  );
}
