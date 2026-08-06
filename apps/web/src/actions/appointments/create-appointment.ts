"use server";

import { AppointmentStatus as PrismaAppointmentStatus } from "@/generated/prisma/client";
import type {
  AppointmentActionResult,
  AppointmentFormValues,
} from "@/types/appointment";

import { appointmentActionSchema } from "./appointment-action-schema";
import {
  appointmentInclude,
  assertAppointmentRelationsBelongToCompany,
  assertNoAppointmentConflict,
  createActionErrorResult,
  createValidationErrorResult,
  getAppointmentDateRange,
  getDemoCompanyIdOrThrow,
  mapAppointmentResult,
  prisma,
  revalidateAgendaPath,
} from "./appointment-action-utils";

export async function createAppointment(
  input: AppointmentFormValues,
): Promise<AppointmentActionResult> {
  const parsedInput = appointmentActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ??
        "Revise os dados do agendamento.",
    );
  }

  const values = parsedInput.data;
  const { endsAt, startsAt } = getAppointmentDateRange(values);

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const appointment = await prisma.$transaction(async (tx) => {
      await assertAppointmentRelationsBelongToCompany({
        companyId,
        tx,
        values,
      });
      await assertNoAppointmentConflict({
        companyId,
        employeeId: values.employeeId,
        endsAt,
        startsAt,
        tx,
      });

      return tx.appointment.create({
        data: {
          companyId,
          customerId: values.customerId,
          employeeId: values.employeeId,
          endsAt,
          notes: values.notes,
          serviceId: values.serviceId,
          startsAt,
          status: PrismaAppointmentStatus.SCHEDULED,
        },
        include: appointmentInclude,
      });
    });

    revalidateAgendaPath();

    return {
      appointment: mapAppointmentResult({
        appointment,
        notes: values.notes,
      }),
      success: true,
    };
  } catch (error: unknown) {
    return createActionErrorResult(error);
  }
}
