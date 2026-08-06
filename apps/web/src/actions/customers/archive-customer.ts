"use server";

import type { CustomerActionResult } from "@/types/customer";

import { customerIdSchema } from "./customer-action-schema";
import {
  createActionErrorResult,
  createValidationErrorResult,
  CustomerActionError,
  customerInclude,
  getDemoCompanyIdOrThrow,
  mapCustomerResult,
  prisma,
  revalidateCustomersPath,
} from "./customer-action-utils";

export async function archiveCustomer(
  customerId: string,
): Promise<CustomerActionResult> {
  const parsedCustomerId = customerIdSchema.safeParse(customerId);

  if (!parsedCustomerId.success) {
    return createValidationErrorResult(
      parsedCustomerId.error.issues[0]?.message ??
        "Informe um cliente valido.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const currentCustomer = await prisma.customer.findFirst({
      select: {
        archivedAt: true,
        id: true,
      },
      where: {
        companyId,
        id: parsedCustomerId.data,
      },
    });

    if (!currentCustomer) {
      throw new CustomerActionError(
        "Cliente nao encontrado para a empresa de demonstracao.",
      );
    }

    if (currentCustomer.archivedAt) {
      throw new CustomerActionError("Este cliente ja esta arquivado.");
    }

    const customer = await prisma.customer.update({
      data: {
        archivedAt: new Date(),
      },
      include: customerInclude,
      where: {
        id: currentCustomer.id,
      },
    });

    revalidateCustomersPath();

    return {
      customer: mapCustomerResult(customer),
      success: true,
    };
  } catch (error: unknown) {
    return createActionErrorResult(error);
  }
}
