import type { AppointmentStatus } from "@/types/appointment";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AppointmentStatus,
  {
    className: string;
    label: string;
  }
> = {
  confirmed: {
    label: "Confirmado",
    className:
      "border-[#c7dfcf] bg-[#edf8f0] text-[#2c6b42] dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
  },
  scheduled: {
    label: "Agendado",
    className:
      "border-[#dec98d] bg-[#fbf3dc] text-[#7a5d17] dark:border-[#c9a76a]/30 dark:bg-[#c9a76a]/[0.12] dark:text-[#f0d59d]",
  },
  completed: {
    label: "Concluído",
    className:
      "border-[#d8c8b6] bg-[#f4eadc] text-[#5c4b35] dark:border-white/10 dark:bg-white/10 dark:text-foreground",
  },
  canceled: {
    label: "Cancelado",
    className:
      "border-[#e8c7cf] bg-[#faedf0] text-[#8b3348] dark:border-[#f0bcc8]/25 dark:bg-[#7a2638]/[0.18] dark:text-[#f0bcc8]",
  },
};

type AppointmentStatusBadgeProps = Readonly<{
  className?: string;
  status: AppointmentStatus;
}>;

export function AppointmentStatusBadge({
  className,
  status,
}: AppointmentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("shrink-0 px-2.5", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
