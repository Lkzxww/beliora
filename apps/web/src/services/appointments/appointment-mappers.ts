import { AppointmentStatus as PrismaAppointmentStatus } from "@/generated/prisma/client";
import type {
  Appointment as PrismaAppointment,
  Customer as PrismaCustomer,
  Employee as PrismaEmployee,
  Service as PrismaService,
} from "@/generated/prisma/client";
import type {
  Appointment,
  AppointmentCustomerOption,
  AppointmentProfessional,
  AppointmentServerStatus,
  AppointmentService,
  AppointmentStatus,
} from "@/types/appointment";

import { isDemoConfirmedAppointment } from "./demo-company";

export type PrismaAppointmentWithRelations = PrismaAppointment & {
  customer: PrismaCustomer;
  employee: PrismaEmployee;
  service: PrismaService;
};

const shortWeekDayLabels = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

const shortMonthLabels = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function formatIsoDate(date: Date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

function formatTime(date: Date) {
  return `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

function formatDayLabel(date: Date) {
  return `${shortWeekDayLabels[date.getDay()]}, ${padDatePart(
    date.getDate(),
  )} ${shortMonthLabels[date.getMonth()]}`;
}

function formatPriceLabel(service: PrismaService) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(service.price.toNumber());
}

function getCustomerInitials(customerName: string) {
  const initials = customerName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  return initials || "CL";
}

function getRoomLabel(employeeId: string) {
  const roomNumber =
    (Array.from(employeeId).reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0,
    ) %
      3) +
    1;

  return `Sala ${padDatePart(roomNumber)}`;
}

export function mapPrismaStatusToAppointmentStatus({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentServerStatus;
}): AppointmentStatus {
  if (status === PrismaAppointmentStatus.CONFIRMED) {
    return "confirmed";
  }

  if (status === PrismaAppointmentStatus.COMPLETED) {
    return "completed";
  }

  if (status === PrismaAppointmentStatus.CANCELED) {
    return "canceled";
  }

  // Backward-compatible fallback for demo data created before CONFIRMED
  // existed in the schema.
  if (isDemoConfirmedAppointment(appointmentId)) {
    return "confirmed";
  }

  return "scheduled";
}

function getPaymentStatus(status: AppointmentStatus) {
  const paymentStatusByAppointmentStatus: Record<AppointmentStatus, string> = {
    canceled: "Cancelado",
    completed: "Pago",
    confirmed: "Sinal pago",
    scheduled: "A receber",
  };

  return paymentStatusByAppointmentStatus[status];
}

export function mapEmployeeToAppointmentProfessional(
  employee: PrismaEmployee,
): AppointmentProfessional {
  return {
    id: employee.id,
    name: employee.name,
    role: "Profissional",
  };
}

export function mapCustomerToAppointmentCustomerOption(
  customer: PrismaCustomer,
): AppointmentCustomerOption {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
  };
}

export function mapServiceToAppointmentService(
  service: PrismaService,
): AppointmentService {
  return {
    durationMinutes: service.duration,
    id: service.id,
    name: service.name,
    priceLabel: formatPriceLabel(service),
  };
}

export function mapPrismaAppointmentToAppointment(
  appointment: PrismaAppointmentWithRelations,
): Appointment {
  const status = mapPrismaStatusToAppointmentStatus({
    appointmentId: appointment.id,
    status: appointment.status,
  });

  return {
    customer: {
      id: appointment.customer.id,
      initials: getCustomerInitials(appointment.customer.name),
      name: appointment.customer.name,
      phone: appointment.customer.phone,
    },
    dayLabel: formatDayLabel(appointment.startsAt),
    endTime: formatTime(appointment.endsAt),
    id: appointment.id,
    isoDate: formatIsoDate(appointment.startsAt),
    paymentStatus: getPaymentStatus(status),
    professional: mapEmployeeToAppointmentProfessional(appointment.employee),
    room: getRoomLabel(appointment.employee.id),
    service: mapServiceToAppointmentService(appointment.service),
    startTime: formatTime(appointment.startsAt),
    status,
    notes: appointment.notes ?? undefined,
  };
}
