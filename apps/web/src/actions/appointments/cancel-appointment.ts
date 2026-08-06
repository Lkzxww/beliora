"use server";

import { AppointmentStatus as PrismaAppointmentStatus } from "@/generated/prisma/client";
import type { AppointmentActionResult } from "@/types/appointment";

import { appointmentIdSchema } from "./appointment-action-schema";
import {
  AppointmentActionError,
  appointmentInclude,
  createActionErrorResult,
  createValidationErrorResult,
  getDemoCompanyIdOrThrow,
  mapAppointmentResult,
  prisma,
  revalidateAgendaPath,
} from "./appointment-action-utils";

export async function cancelAppointment(
  appointmentId: string,
): Promise<AppointmentActionResult> {
  const parsedAppointmentId = appointmentIdSchema.safeParse(appointmentId);

  if (!parsedAppointmentId.success) {
    return createValidationErrorResult(
      parsedAppointmentId.error.issues[0]?.message ??
        "Informe um agendamento válido.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const appointment = await prisma.$transaction(async (tx) => {
      const currentAppointment = await tx.appointment.findFirst({
        select: {
          id: true,
          status: true,
        },
        where: {
          companyId,
          id: parsedAppointmentId.data,
        },
      });

      if (!currentAppointment) {
        throw new AppointmentActionError(
          "Agendamento não encontrado para a empresa de demonstração.",
        );
      }

      if (currentAppointment.status === PrismaAppointmentStatus.CANCELED) {
        throw new AppointmentActionError(
          "Este agendamento já está cancelado.",
        );
      }

      return tx.appointment.update({
        data: {
          status: PrismaAppointmentStatus.CANCELED,
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
      }),
      success: true,
    };
  } catch (error: unknown) {
    return createActionErrorResult(error);
  }
}
