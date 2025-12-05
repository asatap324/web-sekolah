"use client";
import { cn } from "@/lib/utils";
export function StyledCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col rounded-2xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72 lg:col-span-1",
        className,
      )}
    >
      <div className="-m-px border bg-background p-2 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] rounded-t-2xl rounded-b-xl dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
        {children}
      </div>
    </div>
  );
}
