"use server";

import type { ServiceActionResult, ServiceFormValues } from "@/types/service";

import { serviceActionSchema } from "./schema";
import {
  assertServiceNameIsUnique,
  createActionErrorResult,
  createValidationErrorResult,
  getDemoCompanyIdOrThrow,
  getServiceData,
  mapServiceResult,
  prisma,
  revalidateServicePaths,
  serviceInclude,
} from "./utils";

export async function createService(
  input: ServiceFormValues,
): Promise<ServiceActionResult> {
  const parsedInput = serviceActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ?? "Revise os dados do servico.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    await assertServiceNameIsUnique({
      companyId,
      name: parsedInput.data.name,
    });

    const service = await prisma.service.create({
      data: {
        ...getServiceData(parsedInput.data),
        archivedAt: null,
        companyId,
      },
      include: serviceInclude,
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
