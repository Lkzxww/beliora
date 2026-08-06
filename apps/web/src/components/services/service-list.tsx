"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import {
  archiveService,
  createService,
  updateService,
} from "@/actions/services";
import { EmptyState } from "@/components/shared";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCounters } from "@/components/services/service-counters";
import { ServiceDetails } from "@/components/services/service-details";
import { ServiceFilter } from "@/components/services/service-filter";
import { ServiceHeader } from "@/components/services/service-header";
import { ServiceSheet } from "@/components/services/service-sheet";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  Service,
  ServiceFilters,
  ServiceFormValues,
} from "@/types/service";

type ServiceListProps = Readonly<{
  services: Service[];
}>;

type ServiceSheetMode = "create" | "edit";

const initialFilters: ServiceFilters = {
  category: "all",
  search: "",
  status: "all",
};

function getServiceFormValues(service: Service): ServiceFormValues {
  return {
    category: service.category,
    color: service.color,
    description: service.description ?? "",
    duration: service.duration,
    name: service.name,
    price: service.price,
  };
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function matchesServiceSearch(service: Service, search: string) {
  const normalizedSearch = normalizeSearch(search);

  if (normalizedSearch.length === 0) {
    return true;
  }

  return [service.name, service.category].some((value) =>
    value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
  );
}

function sortServices(services: Service[]) {
  return [...services].sort((firstService, secondService) => {
    if (firstService.status !== secondService.status) {
      return firstService.status === "active" ? -1 : 1;
    }

    return firstService.name.localeCompare(secondService.name, "pt-BR");
  });
}

export function ServiceList({ services: initialServices }: ServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters);
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialServices[0]?.id ?? "",
  );
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isServiceSheetOpen, setIsServiceSheetOpen] = useState(false);
  const [serviceSheetMode, setServiceSheetMode] =
    useState<ServiceSheetMode>("create");
  const [editingServiceId, setEditingServiceId] = useState<string | undefined>();
  const [serviceActionError, setServiceActionError] = useState<
    string | undefined
  >();
  const [archiveServiceError, setArchiveServiceError] = useState<
    string | undefined
  >();
  const [archivePendingServiceId, setArchivePendingServiceId] = useState<
    string | undefined
  >();

  const filteredServices = useMemo(
    () =>
      sortServices(
        services.filter((service) => {
          const matchesStatus =
            filters.status === "all" || service.status === filters.status;
          const matchesCategory =
            filters.category === "all" || service.category === filters.category;
          const matchesSearch = matchesServiceSearch(service, filters.search);

          return matchesStatus && matchesCategory && matchesSearch;
        }),
      ),
    [filters, services],
  );
  const selectedService =
    filteredServices.find((service) => service.id === selectedServiceId) ??
    filteredServices[0];
  const editingService = services.find(
    (service) => service.id === editingServiceId,
  );
  const serviceFormInitialValues = useMemo(() => {
    if (serviceSheetMode !== "edit" || !editingService) {
      return undefined;
    }

    return getServiceFormValues(editingService);
  }, [editingService, serviceSheetMode]);

  function handleSelectService(service: Service) {
    setArchiveServiceError(undefined);
    setSelectedServiceId(service.id);

    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileDetailsOpen(true);
    }
  }

  function openCreateService() {
    setServiceActionError(undefined);
    setServiceSheetMode("create");
    setEditingServiceId(undefined);
    setIsServiceSheetOpen(true);
  }

  function openEditService(service: Service) {
    setServiceActionError(undefined);
    setSelectedServiceId(service.id);
    setServiceSheetMode("edit");
    setEditingServiceId(service.id);
    setIsMobileDetailsOpen(false);
    setIsServiceSheetOpen(true);
  }

  function handleServiceSheetOpenChange(isOpen: boolean) {
    setIsServiceSheetOpen(isOpen);

    if (!isOpen) {
      setServiceActionError(undefined);
      setServiceSheetMode("create");
      setEditingServiceId(undefined);
    }
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  async function handleSubmitService(values: ServiceFormValues) {
    setServiceActionError(undefined);

    if (serviceSheetMode === "edit" && editingService) {
      const result = await updateService({
        serviceId: editingService.id,
        values,
      });

      if (!result.success) {
        setServiceActionError(result.message);
        return false;
      }

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === result.service.id ? result.service : service,
        ),
      );
      setSelectedServiceId(result.service.id);
      handleServiceSheetOpenChange(false);

      return true;
    }

    const result = await createService(values);

    if (!result.success) {
      setServiceActionError(result.message);
      return false;
    }

    setServices((currentServices) => [...currentServices, result.service]);
    setSelectedServiceId(result.service.id);
    handleServiceSheetOpenChange(false);

    return true;
  }

  async function handleArchiveService(service: Service) {
    setArchiveServiceError(undefined);
    setArchivePendingServiceId(service.id);

    const result = await archiveService(service.id);

    setArchivePendingServiceId(undefined);

    if (!result.success) {
      setArchiveServiceError(result.message);
      return;
    }

    setServices((currentServices) =>
      currentServices.map((currentService) =>
        currentService.id === result.service.id
          ? result.service
          : currentService,
      ),
    );
    setSelectedServiceId(result.service.id);
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <ServiceHeader onCreateService={openCreateService} />

      <ServiceCounters services={filteredServices} />

      <ServiceFilter filters={filters} onFilterChange={setFilters} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          {filteredServices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={service.id === selectedService?.id}
                  onSelectService={handleSelectService}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX className="size-5" aria-hidden="true" />}
              title="Nenhum serviço encontrado"
              description="Ajuste a pesquisa ou limpe os filtros para ver o catálogo."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-11 rounded-2xl border-[#e2d6c8] bg-white/75 px-5 text-sm font-semibold text-[#423832] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
                >
                  Limpar filtros
                </Button>
              }
              className="min-h-[26rem] rounded-[1.75rem] bg-white/[0.72] dark:bg-card/[0.72]"
            />
          )}
        </div>

        <div className="hidden md:block">
          <ServiceDetails
            archiveError={archiveServiceError}
            service={selectedService}
            isArchivePending={
              Boolean(selectedService) &&
              archivePendingServiceId === selectedService?.id
            }
            onArchiveService={handleArchiveService}
            onEditService={openEditService}
          />
        </div>
      </section>

      <Sheet open={isMobileDetailsOpen} onOpenChange={setIsMobileDetailsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto rounded-t-[2rem] border-[#eadfd3] bg-[#f7f2eb] p-3 shadow-[0_24px_70px_rgba(24,22,21,0.22)] dark:border-white/10 dark:bg-[#11100f] md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhes do serviço</SheetTitle>
            <SheetDescription>
              Informações do serviço selecionado na lista mobile.
            </SheetDescription>
          </SheetHeader>
          <ServiceDetails
            archiveError={archiveServiceError}
            service={selectedService}
            isArchivePending={
              Boolean(selectedService) &&
              archivePendingServiceId === selectedService?.id
            }
            onArchiveService={handleArchiveService}
            onEditService={openEditService}
          />
        </SheetContent>
      </Sheet>

      <ServiceSheet
        actionError={serviceActionError}
        initialValues={serviceFormInitialValues}
        isOpen={isServiceSheetOpen}
        mode={serviceSheetMode}
        service={editingService}
        onOpenChange={handleServiceSheetOpenChange}
        onSubmitService={handleSubmitService}
      />
    </div>
  );
}
