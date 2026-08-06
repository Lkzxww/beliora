"use server";

import type {
  AppointmentActionResult,
  AppointmentFormValues,
} from "@/types/appointment";

import { updateAppointmentActionSchema } from "./appointment-action-schema";
import {
  AppointmentActionError,
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

export async function updateAppointment({
  appointmentId,
  values: inputValues,
}: {
  appointmentId: string;
  values: AppointmentFormValues;
}): Promise<AppointmentActionResult> {
  const parsedInput = updateAppointmentActionSchema.safeParse({
    appointmentId,
    values: inputValues,
  });

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ??
        "Revise os dados do agendamento.",
    );
  }

  const values = parsedInput.data.values;
  const { endsAt, startsAt } = getAppointmentDateRange(values);

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const appointment = await prisma.$transaction(async (tx) => {
      const currentAppointment = await tx.appointment.findFirst({
        select: {
          id: true,
        },
        where: {
          companyId,
          id: parsedInput.data.appointmentId,
        },
      });

      if (!currentAppointment) {
        throw new AppointmentActionError(
          "Agendamento não encontrado para a empresa de demonstração.",
        );
      }

      await assertAppointmentRelationsBelongToCompany({
        companyId,
        tx,
        values,
      });
      await assertNoAppointmentConflict({
        companyId,
        employeeId: values.employeeId,
        endsAt,
        ignoreAppointmentId: currentAppointment.id,
        startsAt,
        tx,
      });

      return tx.appointment.update({
        data: {
          customerId: values.customerId,
          employeeId: values.employeeId,
          endsAt,
          notes: values.notes,
          serviceId: values.serviceId,
          startsAt,
        },
        include: appointmentInclude,
        where: {
          id: currentAppointment.id,
        },
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
