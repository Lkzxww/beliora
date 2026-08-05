import type { Metadata } from "next";

import { AppointmentSchedule } from "@/components/appointments";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  appointmentProfessionals,
  appointmentServices,
  appointmentStatusOptions,
  appointmentViewOptions,
  mockAppointments,
} from "@/mock/appointments";

export const metadata: Metadata = {
  title: "Agenda | Beliora",
  description: "Agenda semanal da Beliora",
};

export default function AgendaPage() {
  return (
    <DashboardLayout activePath="/agenda">
      <AppointmentSchedule
        appointments={mockAppointments}
        defaultSelectedAppointmentId={mockAppointments[0]?.id}
        professionals={appointmentProfessionals}
        services={appointmentServices}
        statuses={appointmentStatusOptions}
        viewOptions={appointmentViewOptions}
      />
    </DashboardLayout>
  );
}
