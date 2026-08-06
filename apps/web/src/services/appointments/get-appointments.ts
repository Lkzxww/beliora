import { prisma } from "@/lib/prisma";
import type { Appointment } from "@/types/appointment";

import {
  mapPrismaAppointmentToAppointment,
  type PrismaAppointmentWithRelations,
} from "./appointment-mappers";
import { getDemoCompany } from "./demo-company";

export async function getAppointments(): Promise<Appointment[]> {
  const company = await getDemoCompany();

  if (!company) {
    return [];
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
      employee: true,
      service: true,
    },
    orderBy: {
      startsAt: "asc",
    },
    where: {
      companyId: company.id,
    },
  });

  return appointments.map((appointment: PrismaAppointmentWithRelations) =>
    mapPrismaAppointmentToAppointment(appointment),
  );
}
