"use server";

import type { ServiceActionResult } from "@/types/service";

import { serviceIdSchema } from "./schema";
import {
  createActionErrorResult,
  createValidationErrorResult,
  getDemoCompanyIdOrThrow,
  mapServiceResult,
  prisma,
  revalidateServicePaths,
  ServiceActionError,
  serviceInclude,
} from "./utils";

export async function archiveService(
  serviceId: string,
): Promise<ServiceActionResult> {
  const parsedServiceId = serviceIdSchema.safeParse(serviceId);

  if (!parsedServiceId.success) {
    return createValidationErrorResult(
      parsedServiceId.error.issues[0]?.message ??
        "Informe um servico valido.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const currentService = await prisma.service.findFirst({
      select: {
        archivedAt: true,
        id: true,
      },
      where: {
        companyId,
        id: parsedServiceId.data,
      },
    });

    if (!currentService) {
      throw new ServiceActionError(
        "Servico nao encontrado para a empresa de demonstracao.",
      );
    }

    if (currentService.archivedAt) {
      throw new ServiceActionError("Este servico ja esta arquivado.");
    }

    const service = await prisma.service.update({
      data: {
        archivedAt: new Date(),
      },
      include: serviceInclude,
      where: {
        id: currentService.id,
      },
    });

    revalidateServicePaths();

    return {
      service: mapServiceResult(service),
      success: true,
    };
  } catch (error: unknown) {
    return createActionErrorResult(error);
  }
}
