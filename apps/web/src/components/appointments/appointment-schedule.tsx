"use client";

import { useEffect, useMemo, useState } from "react";

import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import {
  addWeeks,
  getAppointmentCalendarSummary,
  getAppointmentDayLabel,
  getAppointmentWeekDays,
  getCurrentTimeMarker,
  getStartOfWeek,
  type CurrentTimeMarker,
} from "@/components/appointments/appointment-calendar-utils";
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
} from "@/types/appointment";

type AppointmentScheduleProps = Readonly<{
  appointments: Appointment[];
  defaultSelectedAppointmentId?: string;
  professionals: AppointmentProfessional[];
  services: AppointmentService[];
  statuses: AppointmentFilterOption[];
  viewOptions: Array<{
    label: string;
    value: AppointmentViewMode;
  }>;
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
  viewOptions,
}: AppointmentScheduleProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedWeekStart, setSelectedWeekStart] = useState(() =>
    getStartOfWeek(new Date()),
  );
  const [currentTimeMarker, setCurrentTimeMarker] =
    useState<CurrentTimeMarker>(() => getCurrentTimeMarker());
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
  const selectedView: AppointmentViewMode = "week";
  const weekDays = useMemo(
    () => getAppointmentWeekDays(selectedWeekStart, currentTimeMarker.isoDate),
    [currentTimeMarker.isoDate, selectedWeekStart],
  );
  const calendarSummary = useMemo(
    () =>
      getAppointmentCalendarSummary({
        selectedView,
        weekDays,
      }),
    [selectedView, weekDays],
  );
  const weekDateSet = useMemo(
    () => new Set(weekDays.map((day) => day.isoDate)),
    [weekDays],
  );
  const weekAppointments = useMemo(
    () =>
      appointments.filter((appointment) =>
        weekDateSet.has(appointment.isoDate),
      ),
    [appointments, weekDateSet],
  );
  const selectedAppointment =
    weekAppointments.find(
      (appointment) => appointment.id === selectedAppointmentId,
    ) ?? weekAppointments[0];
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
      const matchesWeek = weekDateSet.has(appointment.isoDate);
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
        matchesWeek &&
        matchesProfessional &&
        matchesService &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [appointments, filters, weekDateSet]);

  useEffect(() => {
    function updateCurrentTime() {
      setCurrentTimeMarker(getCurrentTimeMarker());
    }

    updateCurrentTime();

    const intervalId = window.setInterval(updateCurrentTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function handleSelectAppointment(appointment: Appointment) {
    setSelectedAppointmentId(appointment.id);

    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileDetailsOpen(true);
    }
  }

  function handleGoToToday() {
    setSelectedWeekStart(getStartOfWeek(new Date()));
  }

  function handleGoToPreviousWeek() {
    setSelectedWeekStart((currentWeekStart) =>
      addWeeks(currentWeekStart, -1),
    );
  }

  function handleGoToNextWeek() {
    setSelectedWeekStart((currentWeekStart) => addWeeks(currentWeekStart, 1));
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

    if (!professional || !service || !weekDateSet.has(values.isoDate)) {
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
        dayLabel: getAppointmentDayLabel(values.isoDate),
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
      dayLabel: getAppointmentDayLabel(values.isoDate),
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
          monthLabel={calendarSummary.monthLabel}
          selectedView={calendarSummary.selectedView}
          viewOptions={viewOptions}
          weekLabel={calendarSummary.weekLabel}
          onGoToNextWeek={handleGoToNextWeek}
          onGoToPreviousWeek={handleGoToPreviousWeek}
          onGoToToday={handleGoToToday}
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
            currentTimeMarker={currentTimeMarker}
            selectedAppointmentId={selectedAppointment?.id}
            weekDays={weekDays}
            onSelectAppointment={handleSelectAppointment}
          />
          <AppointmentMobileList
            appointments={filteredAppointments}
            currentTimeMarker={currentTimeMarker}
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
