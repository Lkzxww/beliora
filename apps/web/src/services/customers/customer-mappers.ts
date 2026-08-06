import { AppointmentStatus as PrismaAppointmentStatus } from "@/generated/prisma/client";
import type {
  Appointment as PrismaAppointment,
  Customer as PrismaCustomer,
} from "@/generated/prisma/client";
import type { Customer } from "@/types/customer";

export type PrismaCustomerWithAppointments = PrismaCustomer & {
  appointments: Array<Pick<PrismaAppointment, "id" | "startsAt" | "status">>;
};

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

function getCustomerInitials(customerName: string) {
  const initials = customerName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0]?.toUpperCase())
    .join("");

  return initials || "CL";
}

function formatShortDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${
    shortMonthLabels[date.getMonth()]
  }`;
}

function countUpcomingAppointments(
  appointments: PrismaCustomerWithAppointments["appointments"],
  now: Date,
) {
  return appointments.filter(
    (appointment) =>
      appointment.startsAt >= now &&
      appointment.status !== PrismaAppointmentStatus.CANCELED,
  ).length;
}

export function mapPrismaCustomerToCustomer({
  customer,
  now = new Date(),
}: {
  customer: PrismaCustomerWithAppointments;
  now?: Date;
}): Customer {
  const lastAppointment = customer.appointments[0];

  return {
    archivedAt: customer.archivedAt?.toISOString(),
    appointmentCount: customer.appointments.length,
    createdAt: customer.createdAt.toISOString(),
    email: customer.email ?? undefined,
    id: customer.id,
    initials: getCustomerInitials(customer.name),
    lastAppointmentLabel: lastAppointment
      ? formatShortDate(lastAppointment.startsAt)
      : undefined,
    name: customer.name,
    phone: customer.phone,
    status: customer.archivedAt ? "archived" : "active",
    upcomingAppointmentCount: countUpcomingAppointments(
      customer.appointments,
      now,
    ),
  };
}
