import { DashboardMainContent } from "@/components/dashboard/dashboard-main-content";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardMainContent />
    </DashboardLayout>
  );
}
