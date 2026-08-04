import Link from "next/link";
import {
  CalendarDays,
  ChartNoAxesColumn,
  LayoutDashboard,
  Scissors,
  Settings,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    current: true,
  },
  {
    label: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
    current: false,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    current: false,
  },
  {
    label: "Funcionários",
    href: "/funcionarios",
    icon: UserCog,
    current: false,
  },
  {
    label: "Serviços",
    href: "/servicos",
    icon: Scissors,
    current: false,
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: WalletCards,
    current: false,
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: ChartNoAxesColumn,
    current: false,
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    current: false,
  },
] as const;

type DashboardSidebarProps = {
  variant?: "desktop" | "mobile";
};

export function DashboardSidebar({
  variant = "desktop",
}: DashboardSidebarProps) {
  if (variant === "mobile") {
    return (
      <div className="border-b border-[#2a2522] bg-[#181615] lg:hidden">
        <nav
          aria-label="Navegação principal"
          className="flex gap-2 overflow-x-auto px-4 py-3"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#bfb6ad] transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/60",
                  item.current &&
                    "bg-[#f4eadc] text-[#231b19] shadow-sm hover:bg-[#f4eadc] hover:text-[#231b19]",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-white/10 bg-[#181615] text-white shadow-[24px_0_80px_rgba(24,22,21,0.18)] lg:flex">
      <div className="flex h-24 items-center border-b border-white/10 px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#d2b675]/30 bg-[#f3e7d4] text-base font-semibold text-[#241b17] shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-normal">
              Beliora
            </span>
            <span className="block truncate text-xs font-medium text-[#b9afa6]">
              Gestão para beleza
            </span>
          </span>
        </Link>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 px-4 py-5">
        <p className="mb-3 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d8278]">
          Menu
        </p>
        <div className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#bfb6ad] transition-all duration-200 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a76a]/60",
                  item.current &&
                    "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                )}
              >
                {item.current ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#c9a76a]" />
                ) : null}
                <Icon
                  className={cn(
                    "size-[1.125rem] text-[#8f857c] transition-colors duration-200 group-hover:text-[#f3e7d4]",
                    item.current && "text-[#c9a76a]",
                  )}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-semibold text-white">
                Studio Central
              </p>
              <p className="truncate text-xs text-[#b9afa6]">
                Unidade ativa
              </p>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 border border-[#d2b675]/30 bg-[#f3e7d4] text-[#2b211b]"
            >
              Pro
            </Badge>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-[#c9a76a]" />
          </div>
          <p className="mt-3 text-xs text-[#9f948a]">Plano premium ativo</p>
        </div>
      </div>
    </aside>
  );
}
