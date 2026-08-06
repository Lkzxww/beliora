import { revalidatePath } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getDemoCompany } from "@/services/appointments/demo-company";
import {
  mapPrismaServiceToService,
  type PrismaServiceWithAppointments,
} from "@/services/services";
import type { Service, ServiceActionResult } from "@/types/service";

import type { ServiceActionInput } from "./schema";

export const serviceInclude = {
  appointments: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.ServiceInclude;

export class ServiceActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceActionError";
  }
}

export function createActionErrorResult(error: unknown): ServiceActionResult {
  if (error instanceof ServiceActionError) {
    return {
      message: error.message,
      success: false,
    };
  }

  return {
    message: "Nao foi possivel salvar o servico. Tente novamente.",
    success: false,
  };
}

export function createValidationErrorResult(message: string) {
  return {
    message,
    success: false,
  } satisfies ServiceActionResult;
}

export async function getDemoCompanyIdOrThrow() {
  const company = await getDemoCompany();

  if (!company) {
    throw new ServiceActionError(
      "Empresa de demonstracao nao encontrada. Execute o seed antes de continuar.",
    );
  }

  return company.id;
}

function normalizePrice(value: string) {
  const parsedPrice = Number(value.trim().replace(",", "."));

  return parsedPrice.toFixed(2);
}

export function getServiceData(values: ServiceActionInput) {
  const description = values.description?.trim();

  return {
    category: values.category,
    color: values.color,
    description: description ? description : null,
    duration: values.duration,
    name: values.name.trim(),
    price: normalizePrice(values.price),
  };
}

export async function assertServiceNameIsUnique({
  companyId,
  ignoreServiceId,
  name,
}: {
  companyId: string;
  ignoreServiceId?: string;
  name: string;
}) {
  const existingService = await prisma.service.findFirst({
    select: {
      id: true,
    },
    where: {
      companyId,
      id: ignoreServiceId
        ? {
            not: ignoreServiceId,
          }
        : undefined,
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingService) {
    throw new ServiceActionError(
      "Ja existe um servico com este nome nesta empresa.",
    );
  }
}

export function mapServiceResult(
  service: PrismaServiceWithAppointments,
): Service {
  return mapPrismaServiceToService(service);
}

export function revalidateServicePaths() {
  try {
    revalidatePath("/servicos");
    revalidatePath("/agenda");
  } catch {
    // The mutation has already succeeded. This keeps direct local action tests
    // from reporting a false failure outside the Next runtime.
  }
}

export { prisma };
