"use client";

import { useMemo, useState } from "react";

import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { AppointmentCancelSheet } from "@/components/appointments/appointment-cancel-sheet";
import { AppointmentCounters } from "@/components/appointments/appointment-counters";
import { AppointmentDetails } from "@/components/appointments/appointment-details";
import { type NewAppointmentFormValues } from "@/components/appointments/appointment-form";
import { AppointmentFilter } from "@/components/appointments/appointment-filter";
import { AppointmentHeader } from "@/components/appointments/appointment-header";
import { AppointmentMobileList } from "@/components/appointments/appointment-mobile-list";
import { AppointmentNewSheet } from "@/components/appointments/appointment-new-sheet";
import { AppointmentToolbar } from "@/components/appointments/appointment-toolbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentFilterOption,
  AppointmentProfessional,
  AppointmentService,
  AppointmentViewMode,
  AppointmentWeekDay,
} from "@/types/appointment";

type AppointmentScheduleProps = Readonly<{
  appointments: Appointment[];
  defaultSelectedAppointmentId?: string;
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  statuses: AppointmentFilterOption[];
  summary: {
    monthLabel: string;
    nextWeekHref: string;
    previousWeekHref: string;
    selectedView: AppointmentViewMode;
    todayHref: string;
    weekLabel: string;
  };
  viewOptions: Array<{
    label: string;
    value: AppointmentViewMode;
  }>;
  weekDays: AppointmentWeekDay[];
}>;

type AppointmentSheetMode = "create" | "edit";

const initialFilters: AppointmentFilters = {
  professionalId: "all",
  search: "",
  serviceId: "all",
  status: "all",
};

function getCustomerInitials(customerName: string) {
  const initials = customerName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  return initials || "CL";
}

function waitForMockSave() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 450);
  });
}

function getAppointmentFormValues(
  appointment: Appointment,
): NewAppointmentFormValues {
  return {
    customerName: appointment.customer.name,
    endTime: appointment.endTime,
    isoDate: appointment.isoDate,
    notes: appointment.notes ?? "Sem observações.",
    professionalId: appointment.professional.id,
    serviceId: appointment.service.id,
    startTime: appointment.startTime,
  };
}

export function AppointmentSchedule({
  appointments: initialAppointments,
  defaultSelectedAppointmentId,
  professionals,
  services,
  statuses,
  summary,
  viewOptions,
  weekDays,
}: AppointmentScheduleProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    defaultSelectedAppointmentId ?? initialAppointments[0]?.id ?? "",
  );
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isAppointmentSheetOpen, setIsAppointmentSheetOpen] = useState(false);
  const [appointmentSheetMode, setAppointmentSheetMode] =
    useState<AppointmentSheetMode>("create");
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | undefined
  >();
  const [isCancelAppointmentOpen, setIsCancelAppointmentOpen] =
    useState(false);
  const [appointmentPendingCancelId, setAppointmentPendingCancelId] = useState<
    string | undefined
  >();
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);

  const selectedAppointment =
    appointments.find(
      (appointment) => appointment.id === selectedAppointmentId,
    ) ?? appointments[0];
  const editingAppointment = appointments.find(
    (appointment) => appointment.id === editingAppointmentId,
  );
  const appointmentPendingCancel = appointments.find(
    (appointment) => appointment.id === appointmentPendingCancelId,
  );
  const appointmentFormInitialValues = useMemo(() => {
    if (appointmentSheetMode !== "edit" || !editingAppointment) {
      return undefined;
    }

    return getAppointmentFormValues(editingAppointment);
  }, [appointmentSheetMode, editingAppointment]);
  const filteredAppointments = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLocaleLowerCase("pt-BR");

    return appointments.filter((appointment) => {
      const matchesProfessional =
        filters.professionalId === "all" ||
        appointment.professional.id === filters.professionalId;
      const matchesService =
        filters.serviceId === "all" ||
        appointment.service.id === filters.serviceId;
      const matchesStatus =
        filters.status === "all" || appointment.status === filters.status;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        appointment.customer.name
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch);

      return (
        matchesProfessional &&
        matchesService &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [appointments, filters]);

  function handleSelectAppointment(appointment: Appointment) {
    setSelectedAppointmentId(appointment.id);

    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileDetailsOpen(true);
    }
  }

  function openCreateAppointment() {
    setAppointmentSheetMode("create");
    setEditingAppointmentId(undefined);
    setIsAppointmentSheetOpen(true);
  }

  function openEditAppointment(appointment: Appointment) {
    setSelectedAppointmentId(appointment.id);
    setAppointmentSheetMode("edit");
    setEditingAppointmentId(appointment.id);
    setIsMobileDetailsOpen(false);
    setIsAppointmentSheetOpen(true);
  }

  function openCancelAppointment(appointment: Appointment) {
    setSelectedAppointmentId(appointment.id);
    setAppointmentPendingCancelId(appointment.id);
    setIsMobileDetailsOpen(false);
    setIsCancelAppointmentOpen(true);
  }

  function handleAppointmentSheetOpenChange(isOpen: boolean) {
    setIsAppointmentSheetOpen(isOpen);

    if (!isOpen) {
      setAppointmentSheetMode("create");
      setEditingAppointmentId(undefined);
    }
  }

  function handleCancelAppointmentOpenChange(isOpen: boolean) {
    setIsCancelAppointmentOpen(isOpen);

    if (!isOpen) {
      setAppointmentPendingCancelId(undefined);
    }
  }

  async function handleSubmitAppointment(values: NewAppointmentFormValues) {
    const professional = professionals.find(
      (item) => item.id === values.professionalId,
    );
    const service = services.find((item) => item.id === values.serviceId);
    const weekDay = weekDays.find((day) => day.isoDate === values.isoDate);

    if (!professional || !service || !weekDay) {
      return;
    }

    await waitForMockSave();

    if (appointmentSheetMode === "edit" && editingAppointment) {
      const updatedAppointment: Appointment = {
        ...editingAppointment,
        customer: {
          ...editingAppointment.customer,
          initials: getCustomerInitials(values.customerName),
          name: values.customerName,
        },
        dayLabel: `${weekDay.weekDay}, ${weekDay.dayNumber} ago`,
        endTime: values.endTime,
        isoDate: values.isoDate,
        notes: values.notes,
        professional,
        service,
        startTime: values.startTime,
      };

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment,
        ),
      );
      setSelectedAppointmentId(updatedAppointment.id);
      setIsMobileDetailsOpen(false);
      handleAppointmentSheetOpenChange(false);

      return;
    }

    const newAppointment: Appointment = {
      id: `apt-local-${Date.now()}`,
      isoDate: values.isoDate,
      dayLabel: `${weekDay.weekDay}, ${weekDay.dayNumber} ago`,
      startTime: values.startTime,
      endTime: values.endTime,
      customer: {
        name: values.customerName,
        phone: "Não informado",
        initials: getCustomerInitials(values.customerName),
      },
      professional,
      service,
      status: "scheduled",
      room: "A definir",
      paymentStatus: "A receber",
      notes: values.notes,
    };

    setAppointments((currentAppointments) => [
      ...currentAppointments,
      newAppointment,
    ]);
    setSelectedAppointmentId(newAppointment.id);
    setIsMobileDetailsOpen(false);
    handleAppointmentSheetOpenChange(false);
  }

  function handleConfirmCancelAppointment() {
    if (!appointmentPendingCancelId) {
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentPendingCancelId
          ? {
              ...appointment,
              status: "canceled",
            }
          : appointment,
      ),
    );
    setSelectedAppointmentId(appointmentPendingCancelId);
    setAppointmentPendingCancelId(undefined);
    setIsCancelAppointmentOpen(false);
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <AppointmentHeader onCreateAppointment={openCreateAppointment} />

      <section
        aria-label="Controles da agenda"
        className="overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-white/[0.82] shadow-[0_18px_50px_rgba(48,37,28,0.08)] dark:border-white/10 dark:bg-card/[0.88]"
      >
        <AppointmentToolbar
          monthLabel={summary.monthLabel}
          nextWeekHref={summary.nextWeekHref}
          previousWeekHref={summary.previousWeekHref}
          selectedView={summary.selectedView}
          todayHref={summary.todayHref}
          viewOptions={viewOptions}
          weekLabel={summary.weekLabel}
        />

        <AppointmentFilter
          filters={filters}
          onFilterChange={setFilters}
          professionals={professionals}
          services={services}
          statuses={statuses}
        />
      </section>

      <AppointmentCounters appointments={filteredAppointments} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <AppointmentCalendar
            appointments={filteredAppointments}
            selectedAppointmentId={selectedAppointment?.id}
            weekDays={weekDays}
            onSelectAppointment={handleSelectAppointment}
          />
          <AppointmentMobileList
            appointments={filteredAppointments}
            selectedAppointmentId={selectedAppointment?.id}
            weekDays={weekDays}
            onSelectAppointment={handleSelectAppointment}
          />
        </div>

        <div className="hidden md:block">
          <AppointmentDetails
            appointment={selectedAppointment}
            onCancelAppointment={openCancelAppointment}
            onEditAppointment={openEditAppointment}
          />
        </div>
      </section>

      <Sheet open={isMobileDetailsOpen} onOpenChange={setIsMobileDetailsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto rounded-t-[2rem] border-[#eadfd3] bg-[#f7f2eb] p-3 shadow-[0_24px_70px_rgba(24,22,21,0.22)] dark:border-white/10 dark:bg-[#11100f] md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhes do atendimento</SheetTitle>
            <SheetDescription>
              Informações do agendamento selecionado na lista mobile.
            </SheetDescription>
          </SheetHeader>
          <AppointmentDetails
            appointment={selectedAppointment}
            onCancelAppointment={openCancelAppointment}
            onEditAppointment={openEditAppointment}
          />
        </SheetContent>
      </Sheet>

      <AppointmentNewSheet
        appointment={editingAppointment}
        initialValues={appointmentFormInitialValues}
        isOpen={isAppointmentSheetOpen}
        mode={appointmentSheetMode}
        professionals={professionals}
        services={services}
        weekDays={weekDays}
        onOpenChange={handleAppointmentSheetOpenChange}
        onSubmitAppointment={handleSubmitAppointment}
      />

      <AppointmentCancelSheet
        appointment={appointmentPendingCancel}
        isOpen={isCancelAppointmentOpen}
        onConfirmCancel={handleConfirmCancelAppointment}
        onOpenChange={handleCancelAppointmentOpenChange}
      />
    </div>
  );
}
