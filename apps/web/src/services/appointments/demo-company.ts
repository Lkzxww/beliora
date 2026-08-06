import { prisma } from "@/lib/prisma";

export const DEMO_COMPANY_ID = "demo-company-beliora";
export const DEMO_COMPANY_SLUG = "beliora-demo";

export const DEMO_CONFIRMED_APPOINTMENT_IDS = [
  "demo-appointment-confirmed-01",
  "demo-appointment-overlap-confirmed",
] as const;

// Temporary tenant resolver. Replace this with the authenticated tenant
// from the session when auth and multi-company routing are implemented.
export async function getDemoCompany() {
  return prisma.company.findUnique({
    where: {
      slug: DEMO_COMPANY_SLUG,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export function isDemoConfirmedAppointment(appointmentId: string) {
  return DEMO_CONFIRMED_APPOINTMENT_IDS.some(
    (confirmedAppointmentId) => confirmedAppointmentId === appointmentId,
  );
}
