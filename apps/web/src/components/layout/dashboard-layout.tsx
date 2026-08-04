import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

type DashboardLayoutProps = Readonly<{
  activePath?: string;
  children: React.ReactNode;
}>;

export function DashboardLayout({
  activePath = "/",
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#211d1b] dark:bg-[#11100f] dark:text-foreground">
      <DashboardSidebar activePath={activePath} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <DashboardHeader />
        <DashboardSidebar activePath={activePath} variant="mobile" />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
