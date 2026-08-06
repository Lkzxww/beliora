"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import {
  archiveCustomer,
  createCustomer,
  updateCustomer,
} from "@/actions/customers";
import { CustomerCard } from "@/components/customers/customer-card";
import { CustomerCounters } from "@/components/customers/customer-counters";
import { CustomerDetails } from "@/components/customers/customer-details";
import { CustomerFilter } from "@/components/customers/customer-filter";
import { CustomerHeader } from "@/components/customers/customer-header";
import { CustomerSheet } from "@/components/customers/customer-sheet";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  Customer,
  CustomerFilters,
  CustomerFormValues,
} from "@/types/customer";

type CustomerListProps = Readonly<{
  customers: Customer[];
}>;

type CustomerSheetMode = "create" | "edit";

const initialFilters: CustomerFilters = {
  search: "",
  status: "all",
};

function getCustomerFormValues(customer: Customer): CustomerFormValues {
  return {
    email: customer.email ?? "",
    name: customer.name,
    phone: customer.phone,
  };
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function matchesCustomerSearch(customer: Customer, search: string) {
  const normalizedSearch = normalizeSearch(search);

  if (normalizedSearch.length === 0) {
    return true;
  }

  return [customer.name, customer.phone, customer.email ?? ""].some((value) =>
    value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
  );
}

function sortCustomers(customers: Customer[]) {
  return [...customers].sort((firstCustomer, secondCustomer) => {
    if (firstCustomer.status !== secondCustomer.status) {
      return firstCustomer.status === "active" ? -1 : 1;
    }

    return firstCustomer.name.localeCompare(secondCustomer.name, "pt-BR");
  });
}

export function CustomerList({ customers: initialCustomers }: CustomerListProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomers[0]?.id ?? "",
  );
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  const [customerSheetMode, setCustomerSheetMode] =
    useState<CustomerSheetMode>("create");
  const [editingCustomerId, setEditingCustomerId] = useState<
    string | undefined
  >();
  const [customerActionError, setCustomerActionError] = useState<
    string | undefined
  >();
  const [archiveCustomerError, setArchiveCustomerError] = useState<
    string | undefined
  >();
  const [archivePendingCustomerId, setArchivePendingCustomerId] = useState<
    string | undefined
  >();

  const filteredCustomers = useMemo(
    () =>
      sortCustomers(
        customers.filter((customer) => {
          const matchesStatus =
            filters.status === "all" || customer.status === filters.status;
          const matchesSearch = matchesCustomerSearch(customer, filters.search);

          return matchesStatus && matchesSearch;
        }),
      ),
    [customers, filters],
  );
  const selectedCustomer =
    filteredCustomers.find((customer) => customer.id === selectedCustomerId) ??
    filteredCustomers[0];
  const editingCustomer = customers.find(
    (customer) => customer.id === editingCustomerId,
  );
  const customerFormInitialValues = useMemo(() => {
    if (customerSheetMode !== "edit" || !editingCustomer) {
      return undefined;
    }

    return getCustomerFormValues(editingCustomer);
  }, [customerSheetMode, editingCustomer]);

  function handleSelectCustomer(customer: Customer) {
    setArchiveCustomerError(undefined);
    setSelectedCustomerId(customer.id);

    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileDetailsOpen(true);
    }
  }

  function openCreateCustomer() {
    setCustomerActionError(undefined);
    setCustomerSheetMode("create");
    setEditingCustomerId(undefined);
    setIsCustomerSheetOpen(true);
  }

  function openEditCustomer(customer: Customer) {
    setCustomerActionError(undefined);
    setSelectedCustomerId(customer.id);
    setCustomerSheetMode("edit");
    setEditingCustomerId(customer.id);
    setIsMobileDetailsOpen(false);
    setIsCustomerSheetOpen(true);
  }

  function handleCustomerSheetOpenChange(isOpen: boolean) {
    setIsCustomerSheetOpen(isOpen);

    if (!isOpen) {
      setCustomerActionError(undefined);
      setCustomerSheetMode("create");
      setEditingCustomerId(undefined);
    }
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  async function handleSubmitCustomer(values: CustomerFormValues) {
    setCustomerActionError(undefined);

    if (customerSheetMode === "edit" && editingCustomer) {
      const result = await updateCustomer({
        customerId: editingCustomer.id,
        values,
      });

      if (!result.success) {
        setCustomerActionError(result.message);
        return false;
      }

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === result.customer.id ? result.customer : customer,
        ),
      );
      setSelectedCustomerId(result.customer.id);
      handleCustomerSheetOpenChange(false);

      return true;
    }

    const result = await createCustomer(values);

    if (!result.success) {
      setCustomerActionError(result.message);
      return false;
    }

    setCustomers((currentCustomers) => [...currentCustomers, result.customer]);
    setSelectedCustomerId(result.customer.id);
    handleCustomerSheetOpenChange(false);

    return true;
  }

  async function handleArchiveCustomer(customer: Customer) {
    setArchiveCustomerError(undefined);
    setArchivePendingCustomerId(customer.id);

    const result = await archiveCustomer(customer.id);

    setArchivePendingCustomerId(undefined);

    if (!result.success) {
      setArchiveCustomerError(result.message);
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.map((currentCustomer) =>
        currentCustomer.id === result.customer.id
          ? result.customer
          : currentCustomer,
      ),
    );
    setSelectedCustomerId(result.customer.id);
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <CustomerHeader onCreateCustomer={openCreateCustomer} />

      <CustomerCounters customers={filteredCustomers} />

      <CustomerFilter filters={filters} onFilterChange={setFilters} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          {filteredCustomers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  isSelected={customer.id === selectedCustomer?.id}
                  onSelectCustomer={handleSelectCustomer}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX className="size-5" aria-hidden="true" />}
              title="Nenhum cliente encontrado"
              description="Ajuste a pesquisa ou limpe os filtros para ver a base de clientes."
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
          <CustomerDetails
            archiveError={archiveCustomerError}
            customer={selectedCustomer}
            isArchivePending={
              Boolean(selectedCustomer) &&
              archivePendingCustomerId === selectedCustomer?.id
            }
            onArchiveCustomer={handleArchiveCustomer}
            onEditCustomer={openEditCustomer}
          />
        </div>
      </section>

      <Sheet open={isMobileDetailsOpen} onOpenChange={setIsMobileDetailsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto rounded-t-[2rem] border-[#eadfd3] bg-[#f7f2eb] p-3 shadow-[0_24px_70px_rgba(24,22,21,0.22)] dark:border-white/10 dark:bg-[#11100f] md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhes do cliente</SheetTitle>
            <SheetDescription>
              Informacoes do cliente selecionado na lista mobile.
            </SheetDescription>
          </SheetHeader>
          <CustomerDetails
            archiveError={archiveCustomerError}
            customer={selectedCustomer}
            isArchivePending={
              Boolean(selectedCustomer) &&
              archivePendingCustomerId === selectedCustomer?.id
            }
            onArchiveCustomer={handleArchiveCustomer}
            onEditCustomer={openEditCustomer}
          />
        </SheetContent>
      </Sheet>

      <CustomerSheet
        actionError={customerActionError}
        customer={editingCustomer}
        initialValues={customerFormInitialValues}
        isOpen={isCustomerSheetOpen}
        mode={customerSheetMode}
        onOpenChange={handleCustomerSheetOpenChange}
        onSubmitCustomer={handleSubmitCustomer}
      />
    </div>
  );
}
