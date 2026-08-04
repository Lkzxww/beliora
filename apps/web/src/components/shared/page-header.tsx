import { cn } from "@/lib/utils";

type PageHeaderProps = Readonly<{
  actions?: React.ReactNode;
  className?: string;
  description: string;
  eyebrow?: string;
  title: string;
}>;

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6426] dark:text-[#f0d59d]">
            {eyebrow}
          </p>
        ) : null}
        <div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-[#211b18] sm:text-4xl dark:text-foreground">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#74675d] sm:text-base dark:text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </section>
  );
}
