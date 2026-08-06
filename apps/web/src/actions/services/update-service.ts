"use server";

import type { ServiceActionResult, ServiceFormValues } from "@/types/service";

import { updateServiceActionSchema } from "./schema";
import {
  assertServiceNameIsUnique,
  createActionErrorResult,
  createValidationErrorResult,
  getDemoCompanyIdOrThrow,
  getServiceData,
  mapServiceResult,
  prisma,
  revalidateServicePaths,
  ServiceActionError,
  serviceInclude,
} from "./utils";

export async function updateService({
  serviceId,
  values: inputValues,
}: {
  serviceId: string;
  values: ServiceFormValues;
}): Promise<ServiceActionResult> {
  const parsedInput = updateServiceActionSchema.safeParse({
    serviceId,
    values: inputValues,
  });

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ?? "Revise os dados do servico.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const currentService = await prisma.service.findFirst({
      select: {
        id: true,
      },
      where: {
        companyId,
        id: parsedInput.data.serviceId,
      },
    });

    if (!currentService) {
      throw new ServiceActionError(
        "Servico nao encontrado para a empresa de demonstracao.",
      );
    }

    await assertServiceNameIsUnique({
      companyId,
      ignoreServiceId: currentService.id,
      name: parsedInput.data.values.name,
    });

    const service = await prisma.service.update({
      data: getServiceData(parsedInput.data.values),
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
