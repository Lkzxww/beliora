import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfd3] bg-[#f7f2eb]/[0.92] backdrop-blur-xl supports-[backdrop-filter]:bg-[#f7f2eb]/[0.82] dark:border-white/10 dark:bg-[#11100f]/[0.86]">
      <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#241b17] text-sm font-semibold text-[#f6ead9] shadow-sm dark:border dark:border-white/10">
            B
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-semibold leading-5 text-[#241f1c] dark:text-foreground">
              Beliora
            </span>
            <span className="block text-xs font-medium text-[#7a6d63] dark:text-muted-foreground">
              Dashboard
            </span>
          </span>
        </Link>

        <div className="relative ml-auto hidden w-full max-w-lg sm:block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Pesquisar clientes, agenda e serviços"
            className="h-11 rounded-2xl border-[#e2d6c8] bg-white/80 pl-11 pr-4 text-[#2b2622] shadow-[0_12px_34px_rgba(64,48,36,0.07)] placeholder:text-[#9b8f84] hover:bg-white focus-visible:border-[#c9a76a] dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:placeholder:text-muted-foreground"
          />
        </div>

        <Button
          variant="outline"
          size="icon-lg"
          aria-label="Notificações"
          className="relative size-10 rounded-xl border-[#e2d6c8] bg-white/70 text-[#423832] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#7a2638] active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
        >
          <Bell className="size-[1.125rem]" aria-hidden="true" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#9f2f45] ring-2 ring-white dark:ring-[#11100f]" />
        </Button>

        <div
          aria-label="Avatar de Ana Souza"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#d8c8b6] bg-[#241b17] text-sm font-semibold text-[#f6ead9] shadow-[0_12px_24px_rgba(36,27,23,0.14)] dark:border-white/10"
        >
          AS
        </div>
      </div>

      <div className="border-t border-[#eadfd3] px-4 py-3 sm:hidden dark:border-white/10">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Pesquisar na Beliora"
            className="h-11 rounded-2xl border-[#e2d6c8] bg-white/80 pl-11 shadow-sm dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>
    </header>
  );
}
