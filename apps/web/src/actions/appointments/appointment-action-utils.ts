import { revalidatePath } from "next/cache";

import { AppointmentStatus as PrismaAppointmentStatus } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import { parseAppointmentDateTime } from "@/lib/appointment-time";
import { prisma } from "@/lib/prisma";
import type {
  Appointment,
  AppointmentActionResult,
  AppointmentFormValues,
} from "@/types/appointment";
import {
  mapPrismaAppointmentToAppointment,
  type PrismaAppointmentWithRelations,
} from "@/services/appointments/appointment-mappers";
import { getDemoCompany } from "@/services/appointments/demo-company";

import type { AppointmentActionInput } from "./appointment-action-schema";

export const appointmentInclude = {
  customer: true,
  employee: true,
  service: true,
} satisfies Prisma.AppointmentInclude;

export class AppointmentActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentActionError";
  }
}

export function createActionErrorResult(
  error: unknown,
): AppointmentActionResult {
  if (error instanceof AppointmentActionError) {
    return {
      message: error.message,
      success: false,
    };
  }

  return {
    message: "Não foi possível salvar o agendamento. Tente novamente.",
    success: false,
  };
}

export function createValidationErrorResult(message: string) {
  return {
    message,
    success: false,
  } satisfies AppointmentActionResult;
}

export function revalidateAgendaPath() {
  try {
    revalidatePath("/agenda");
  } catch {
    // The database mutation has already succeeded. This keeps direct local
    // action tests from reporting a false failure outside the Next runtime.
  }
}

export async function getDemoCompanyIdOrThrow() {
  const company = await getDemoCompany();

  if (!company) {
    throw new AppointmentActionError(
      "Empresa de demonstração não encontrada. Execute o seed antes de continuar.",
    );
  }

  return company.id;
}

export function mapAppointmentResult({
  appointment,
  notes,
}: {
  appointment: PrismaAppointmentWithRelations;
  notes?: string;
}): Appointment {
  const mappedAppointment = mapPrismaAppointmentToAppointment(appointment);

  if (notes === undefined) {
    return mappedAppointment;
  }

  return {
    ...mappedAppointment,
    notes,
  };
}

export async function assertAppointmentRelationsBelongToCompany({
  companyId,
  tx,
  values,
}: {
  companyId: string;
  tx: Prisma.TransactionClient;
  values: AppointmentActionInput;
}) {
  const customer = await tx.customer.findFirst({
    select: {
      id: true,
    },
    where: {
      companyId,
      id: values.customerId,
    },
  });
  const employee = await tx.employee.findFirst({
    select: {
      id: true,
    },
    where: {
      companyId,
      id: values.employeeId,
    },
  });
  const service = await tx.service.findFirst({
    select: {
      id: true,
    },
    where: {
      archivedAt: null,
      companyId,
      id: values.serviceId,
    },
  });

  if (!customer || !employee || !service) {
    throw new AppointmentActionError(
      "Cliente, profissional ou serviço ativo não pertence à empresa de demonstração.",
    );
  }
}

export async function assertNoAppointmentConflict({
  companyId,
  employeeId,
  endsAt,
  ignoreAppointmentId,
  startsAt,
  tx,
}: {
  companyId: string;
  employeeId: string;
  endsAt: Date;
  ignoreAppointmentId?: string;
  startsAt: Date;
  tx: Prisma.TransactionClient;
}) {
  const conflictingAppointment = await tx.appointment.findFirst({
    select: {
      id: true,
    },
    where: {
      companyId,
      employeeId,
      endsAt: {
        gt: startsAt,
      },
      id: ignoreAppointmentId
        ? {
            not: ignoreAppointmentId,
          }
        : undefined,
      startsAt: {
        lt: endsAt,
      },
      status: {
        not: PrismaAppointmentStatus.CANCELED,
      },
    },
  });

  if (conflictingAppointment) {
    throw new AppointmentActionError(
      "Este profissional já possui um atendimento nesse horário.",
    );
  }
}

export function getAppointmentDateRange(values: AppointmentFormValues) {
  return {
    endsAt: parseAppointmentDateTime(values.isoDate, values.endTime),
    startsAt: parseAppointmentDateTime(values.isoDate, values.startTime),
  };
}

export { prisma };
