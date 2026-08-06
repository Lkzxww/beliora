import { revalidatePath } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getDemoCompany } from "@/services/appointments/demo-company";
import {
  mapPrismaCustomerToCustomer,
  type PrismaCustomerWithAppointments,
} from "@/services/customers";
import type { Customer, CustomerActionResult } from "@/types/customer";

import type { CustomerActionInput } from "./customer-action-schema";

export const customerInclude = {
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
} satisfies Prisma.CustomerInclude;

export class CustomerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomerActionError";
  }
}

export function createActionErrorResult(error: unknown): CustomerActionResult {
  if (error instanceof CustomerActionError) {
    return {
      message: error.message,
      success: false,
    };
  }

  return {
    message: "Nao foi possivel salvar o cliente. Tente novamente.",
    success: false,
  };
}

export function createValidationErrorResult(message: string) {
  return {
    message,
    success: false,
  } satisfies CustomerActionResult;
}

export async function getDemoCompanyIdOrThrow() {
  const company = await getDemoCompany();

  if (!company) {
    throw new CustomerActionError(
      "Empresa de demonstracao nao encontrada. Execute o seed antes de continuar.",
    );
  }

  return company.id;
}

export function getCustomerData(values: CustomerActionInput) {
  const email = values.email?.trim();

  return {
    email: email ? email : null,
    name: values.name.trim(),
    phone: values.phone.trim(),
  };
}

export function mapCustomerResult(
  customer: PrismaCustomerWithAppointments,
): Customer {
  return mapPrismaCustomerToCustomer({
    customer,
  });
}

export function revalidateCustomersPath() {
  try {
    revalidatePath("/clientes");
  } catch {
    // The database mutation has already succeeded. This keeps local action
    // tests from reporting a false failure outside the Next runtime.
  }
}

export { prisma };
