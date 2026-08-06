import type { Metadata } from "next";

import { AppointmentSchedule } from "@/components/appointments";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  getAppointmentOptions,
  getAppointments,
} from "@/services/appointments";

export const metadata: Metadata = {
  title: "Agenda | Beliora",
  description: "Agenda semanal da Beliora",
};

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const [appointments, options] = await Promise.all([
    getAppointments(),
    getAppointmentOptions(),
  ]);

  return (
    <DashboardLayout activePath="/agenda">
      <AppointmentSchedule
        appointments={appointments}
        customers={options.customers}
        defaultSelectedAppointmentId={appointments[0]?.id}
        professionals={options.professionals}
        services={options.services}
        statuses={options.statuses}
        viewOptions={options.viewOptions}
      />
    </DashboardLayout>
  );
}
