import { prisma } from "@/lib/prisma";
import { getDemoCompany } from "@/services/appointments/demo-company";
import type { Customer } from "@/types/customer";

import {
  mapPrismaCustomerToCustomer,
  type PrismaCustomerWithAppointments,
} from "./customer-mappers";

export async function getCustomers(): Promise<Customer[]> {
  const company = await getDemoCompany();

  if (!company) {
    return [];
  }

  const now = new Date();
  const customers = await prisma.customer.findMany({
    include: {
      appointments: {
        orderBy: {
          startsAt: "desc",
        },
        select: {
          id: true,
          startsAt: true,
          status: true,
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

  return customers.map((customer: PrismaCustomerWithAppointments) =>
    mapPrismaCustomerToCustomer({ customer, now }),
  );
}
