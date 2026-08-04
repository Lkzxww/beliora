import { cn } from "@/lib/utils";

type EmptyStateProps = Readonly<{
  action?: React.ReactNode;
  className?: string;
  description: string;
  icon?: React.ReactNode;
  title: string;
}>;

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfcaa9] bg-[#fffaf4] p-6 text-center dark:border-white/10 dark:bg-white/[0.035]",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-[#f8eedf] text-[#7a2638] dark:bg-white/10 dark:text-[#f0bcc8]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-[#211b18] dark:text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#74675d] dark:text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
