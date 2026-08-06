"use client";

import { useEffect, useMemo, useState } from "react";

import { cancelAppointment } from "@/actions/appointments/cancel-appointment";
import { createAppointment } from "@/actions/appointments/create-appointment";
import { updateAppointment } from "@/actions/appointments/update-appointment";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import {
  addWeeks,
  getAppointmentCalendarSummary,
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
  AppointmentCustomerOption,
  AppointmentFilters,
  AppointmentFilterOption,
  AppointmentProfessional,
  AppointmentService,
  AppointmentViewMode,
} from "@/types/appointment";

type AppointmentScheduleProps = Readonly<{
  appointments: Appointment[];
  customers: AppointmentCustomerOption[];
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

function getAppointmentFormValues(
  appointment: Appointment,
): NewAppointmentFormValues {
  return {
    customerId: appointment.customer.id,
    endTime: appointment.endTime,
    isoDate: appointment.isoDate,
    notes: appointment.notes ?? "Sem observações.",
    employeeId: appointment.professional.id,
    serviceId: appointment.service.id,
    startTime: appointment.startTime,
  };
}

export function AppointmentSchedule({
  appointments: initialAppointments,
  customers,
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
  const [appointmentActionError, setAppointmentActionError] = useState<
    string | undefined
  >();
  const [cancelAppointmentError, setCancelAppointmentError] = useState<
    string | undefined
  >();
  const [isCancelAppointmentPending, setIsCancelAppointmentPending] =
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
    setAppointmentActionError(undefined);
    setAppointmentSheetMode("create");
    setEditingAppointmentId(undefined);
    setIsAppointmentSheetOpen(true);
  }

  function openEditAppointment(appointment: Appointment) {
    setAppointmentActionError(undefined);
    setSelectedAppointmentId(appointment.id);
    setAppointmentSheetMode("edit");
    setEditingAppointmentId(appointment.id);
    setIsMobileDetailsOpen(false);
    setIsAppointmentSheetOpen(true);
  }

  function openCancelAppointment(appointment: Appointment) {
    setCancelAppointmentError(undefined);
    setSelectedAppointmentId(appointment.id);
    setAppointmentPendingCancelId(appointment.id);
    setIsMobileDetailsOpen(false);
    setIsCancelAppointmentOpen(true);
  }

  function handleAppointmentSheetOpenChange(isOpen: boolean) {
    setIsAppointmentSheetOpen(isOpen);

    if (!isOpen) {
      setAppointmentActionError(undefined);
      setAppointmentSheetMode("create");
      setEditingAppointmentId(undefined);
    }
  }

  function handleCancelAppointmentOpenChange(isOpen: boolean) {
    setIsCancelAppointmentOpen(isOpen);

    if (!isOpen) {
      setCancelAppointmentError(undefined);
      setAppointmentPendingCancelId(undefined);
    }
  }

  async function handleSubmitAppointment(values: NewAppointmentFormValues) {
    setAppointmentActionError(undefined);

    if (appointmentSheetMode === "edit" && editingAppointment) {
      const result = await updateAppointment({
        appointmentId: editingAppointment.id,
        values,
      });

      if (!result.success) {
        setAppointmentActionError(result.message);
        return false;
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === result.appointment.id
            ? result.appointment
            : appointment,
        ),
      );
      setSelectedAppointmentId(result.appointment.id);
      setIsMobileDetailsOpen(false);
      handleAppointmentSheetOpenChange(false);

      return true;
    }

    const result = await createAppointment(values);

    if (!result.success) {
      setAppointmentActionError(result.message);
      return false;
    }

    setAppointments((currentAppointments) => [
      ...currentAppointments,
      result.appointment,
    ]);
    setSelectedAppointmentId(result.appointment.id);
    setIsMobileDetailsOpen(false);
    handleAppointmentSheetOpenChange(false);

    return true;
  }

  async function handleConfirmCancelAppointment() {
    if (!appointmentPendingCancelId) {
      return;
    }

    setCancelAppointmentError(undefined);
    setIsCancelAppointmentPending(true);

    const result = await cancelAppointment(appointmentPendingCancelId);

    setIsCancelAppointmentPending(false);

    if (!result.success) {
      setCancelAppointmentError(result.message);
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === result.appointment.id
          ? result.appointment
          : appointment,
      ),
    );
    setSelectedAppointmentId(result.appointment.id);
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
        actionError={appointmentActionError}
        appointment={editingAppointment}
        customers={customers}
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
        errorMessage={cancelAppointmentError}
        isOpen={isCancelAppointmentOpen}
        isPending={isCancelAppointmentPending}
        onConfirmCancel={handleConfirmCancelAppointment}
        onOpenChange={handleCancelAppointmentOpenChange}
      />
    </div>
  );
}
