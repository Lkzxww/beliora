import { ChevronDown, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AppointmentFilters,
  AppointmentFilterOption,
  AppointmentProfessional,
  AppointmentService,
} from "@/types/appointment";

type AppointmentFilterProps = Readonly<{
  filters: AppointmentFilters;
  onFilterChange: (filters: AppointmentFilters) => void;
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  statuses: AppointmentFilterOption[];
}>;

const selectClassName =
  "h-12 w-full appearance-none rounded-2xl border border-[#e2d6c8] bg-white/80 px-4 pr-11 text-sm font-medium text-[#2b2622] shadow-sm outline-none transition-all duration-200 hover:border-[#d7c6b3] hover:bg-white focus:border-[#c9a76a] focus:ring-3 focus:ring-[#c9a76a]/30 dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10";

const fieldLabelClassName =
  "text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a6426] dark:text-[#f0d59d]";

export function AppointmentFilter({
  filters,
  onFilterChange,
  professionals,
  services,
  statuses,
}: AppointmentFilterProps) {
  function updateFilters(nextFilters: Partial<AppointmentFilters>) {
    onFilterChange({
      ...filters,
      ...nextFilters,
    });
  }

  return (
    <div className="bg-[#fffbf5]/60 px-4 py-4 dark:bg-white/[0.025] sm:px-5">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.85fr)_auto] xl:items-end"
      >
        <label className="space-y-2 md:col-span-2 xl:col-span-1">
          <span className={fieldLabelClassName}>Pesquisar cliente</span>
          <span className="relative block">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              className="h-12 rounded-2xl border-[#e2d6c8] bg-white/80 pl-11 pr-4 text-sm font-medium text-[#2b2622] shadow-sm transition-all duration-200 placeholder:text-[#9b8f84] hover:border-[#d7c6b3] hover:bg-white focus-visible:border-[#c9a76a] dark:border-white/10 dark:bg-white/5 dark:text-foreground"
              placeholder="Pesquisar cliente..."
            />
          </span>
        </label>

        <label className="space-y-2">
          <span className={fieldLabelClassName}>Filtro Profissional</span>
          <span className="relative block">
            <select
              name="professional"
              value={filters.professionalId}
              onChange={(event) =>
                updateFilters({ professionalId: event.target.value })
              }
              className={selectClassName}
            >
              <option value="all">Todos os profissionais</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </label>

        <label className="space-y-2">
          <span className={fieldLabelClassName}>Filtro Serviço</span>
          <span className="relative block">
            <select
              name="service"
              value={filters.serviceId}
              onChange={(event) =>
                updateFilters({ serviceId: event.target.value })
              }
              className={selectClassName}
            >
              <option value="all">Todos os serviços</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </label>

        <label className="space-y-2">
          <span className={fieldLabelClassName}>Filtro Status</span>
          <span className="relative block">
            <select
              name="status"
              value={filters.status}
              onChange={(event) => updateFilters({ status: event.target.value })}
              className={selectClassName}
            >
              {statuses.map((status) => (
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
    </div>
  );
}
