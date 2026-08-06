import type { Metadata } from "next";

import { CustomerList } from "@/components/customers";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getCustomers } from "@/services/customers";

export const metadata: Metadata = {
  title: "Clientes | Beliora",
  description: "Gestao de clientes da Beliora",
};

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const customers = await getCustomers();

  return (
    <DashboardLayout activePath="/clientes">
      <CustomerList customers={customers} />
    </DashboardLayout>
  );
}
