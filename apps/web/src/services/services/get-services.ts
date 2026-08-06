import { prisma } from "@/lib/prisma";
import { getDemoCompany } from "@/services/appointments/demo-company";
import type { Service } from "@/types/service";

import {
  mapPrismaServiceToService,
  type PrismaServiceWithAppointments,
} from "./service-mappers";

export async function getServices(): Promise<Service[]> {
  const company = await getDemoCompany();

  if (!company) {
    return [];
  }

  const services = await prisma.service.findMany({
    include: {
      appointments: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    where: {
      companyId: company.id,
    },
  });

  return services.map((service: PrismaServiceWithAppointments) =>
    mapPrismaServiceToService(service),
  );
}
