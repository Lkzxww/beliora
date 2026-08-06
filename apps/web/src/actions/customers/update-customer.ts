"use server";

import type { CustomerActionResult, CustomerFormValues } from "@/types/customer";

import { updateCustomerActionSchema } from "./customer-action-schema";
import {
  createActionErrorResult,
  createValidationErrorResult,
  CustomerActionError,
  customerInclude,
  getCustomerData,
  getDemoCompanyIdOrThrow,
  mapCustomerResult,
  prisma,
  revalidateCustomersPath,
} from "./customer-action-utils";

export async function updateCustomer({
  customerId,
  values: inputValues,
}: {
  customerId: string;
  values: CustomerFormValues;
}): Promise<CustomerActionResult> {
  const parsedInput = updateCustomerActionSchema.safeParse({
    customerId,
    values: inputValues,
  });

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ?? "Revise os dados do cliente.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const currentCustomer = await prisma.customer.findFirst({
      select: {
        id: true,
      },
      where: {
        companyId,
        id: parsedInput.data.customerId,
      },
    });

    if (!currentCustomer) {
      throw new CustomerActionError(
        "Cliente nao encontrado para a empresa de demonstracao.",
      );
    }

    const customer = await prisma.customer.update({
      data: getCustomerData(parsedInput.data.values),
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
