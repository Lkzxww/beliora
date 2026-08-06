import type { Metadata } from "next";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ServiceList } from "@/components/services";
import { getServices } from "@/services/services";

export const metadata: Metadata = {
  title: "Serviços | Beliora",
  description: "Gestão de serviços da Beliora",
};

export const dynamic = "force-dynamic";

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <DashboardLayout activePath="/servicos">
      <ServiceList services={services} />
    </DashboardLayout>
  );
}
