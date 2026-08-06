"use server";

import type { CustomerActionResult, CustomerFormValues } from "@/types/customer";

import { customerActionSchema } from "./customer-action-schema";
import {
  createActionErrorResult,
  createValidationErrorResult,
  customerInclude,
  getCustomerData,
  getDemoCompanyIdOrThrow,
  mapCustomerResult,
  prisma,
  revalidateCustomersPath,
} from "./customer-action-utils";

export async function createCustomer(
  input: CustomerFormValues,
): Promise<CustomerActionResult> {
  const parsedInput = customerActionSchema.safeParse(input);

  if (!parsedInput.success) {
    return createValidationErrorResult(
      parsedInput.error.issues[0]?.message ?? "Revise os dados do cliente.",
    );
  }

  try {
    const companyId = await getDemoCompanyIdOrThrow();
    const customer = await prisma.customer.create({
      data: {
        ...getCustomerData(parsedInput.data),
        archivedAt: null,
        companyId,
      },
      include: customerInclude,
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
