"use client";

import * as React from "react";
import { Search as SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchProps = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "type" | "value"
> &
  Readonly<{
    iconClassName?: string;
    onValueChange: (value: string) => void;
    value: string;
  }>;

export function Search({
  className,
  iconClassName,
  onValueChange,
  value,
  ...props
}: SearchProps) {
  return (
    <span className="relative block">
      <SearchIcon
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8f8175] dark:text-muted-foreground",
          iconClassName,
        )}
        aria-hidden="true"
      />
      <Input
        {...props}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          "h-12 rounded-2xl border-[#e2d6c8] bg-white/80 pl-11 pr-4 text-sm font-medium text-[#2b2622] shadow-sm transition-all duration-200 placeholder:text-[#9b8f84] hover:border-[#d7c6b3] hover:bg-white focus-visible:border-[#c9a76a] dark:border-white/10 dark:bg-white/5 dark:text-foreground",
          className,
        )}
      />
    </span>
  );
}
