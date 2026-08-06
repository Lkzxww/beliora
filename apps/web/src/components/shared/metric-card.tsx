import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetricCardProps = Readonly<{
  className?: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  label: string;
  value: number | string;
}>;

export function MetricCard({
  className,
  description,
  icon: Icon,
  iconClassName,
  label,
  value,
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.5rem] border border-[#eadfd3] bg-white/[0.78] px-4 py-4 shadow-[0_12px_34px_rgba(48,37,28,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(48,37,28,0.1)] dark:border-white/10 dark:bg-card/[0.78] dark:hover:bg-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8a7a] dark:text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold leading-none text-[#211b18] dark:text-foreground">
            {value}
          </p>
        </div>

        {Icon ? (
          <Icon
            className={cn("size-5 shrink-0 text-[#7a2638]", iconClassName)}
            aria-hidden="true"
          />
        ) : null}
      </div>

      {description ? (
        <p className="mt-3 text-sm leading-6 text-[#74675d] dark:text-muted-foreground">
          {description}
        </p>
      ) : null}
    </article>
  );
}
