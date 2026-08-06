import { prisma } from "@/lib/prisma";
import type {
  AppointmentFilterOption,
  AppointmentOptions,
} from "@/types/appointment";

import {
  mapCustomerToAppointmentCustomerOption,
  mapEmployeeToAppointmentProfessional,
  mapServiceToAppointmentService,
} from "./appointment-mappers";
import { getDemoCompany } from "./demo-company";

const appointmentStatusOptions: AppointmentFilterOption[] = [
  {
    label: "Todos os status",
    value: "all",
  },
  {
    label: "Confirmados",
    value: "confirmed",
  },
  {
    label: "Agendados",
    value: "scheduled",
  },
  {
    label: "Concluídos",
    value: "completed",
  },
  {
    label: "Cancelados",
    value: "canceled",
  },
];

export async function getAppointmentOptions(): Promise<AppointmentOptions> {
  const company = await getDemoCompany();

  if (!company) {
    return {
      customers: [],
      professionals: [],
      services: [],
      statuses: appointmentStatusOptions,
      viewOptions: [
        { label: "Dia", value: "day" },
        { label: "Semana", value: "week" },
        { label: "Mês", value: "month" },
      ],
    };
  }

  const [customers, employees, services] = await Promise.all([
    prisma.customer.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        archivedAt: null,
        companyId: company.id,
      },
    }),
    prisma.employee.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        active: true,
        companyId: company.id,
      },
    }),
    prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        companyId: company.id,
      },
    }),
  ]);

  return {
    customers: customers.map(mapCustomerToAppointmentCustomerOption),
    professionals: employees.map(mapEmployeeToAppointmentProfessional),
    services: services.map(mapServiceToAppointmentService),
    statuses: appointmentStatusOptions,
    viewOptions: [
      { label: "Dia", value: "day" },
      { label: "Semana", value: "week" },
      { label: "Mês", value: "month" },
    ],
  };
}
