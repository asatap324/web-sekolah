"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useGreeting } from "../hooks/use-greeting";
import { usePageTitle } from "../hooks/use-page-title";

export function DynamicHeader() {
  const greeting = useGreeting();
  const { user, isLoading } = useAuth();
  const pageTitle = usePageTitle();

  if (isLoading) {
    return <Skeleton className="h-6 w-48" />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-4xl font-semibold mr-2">
        {greeting}
        {user?.username ? `, ${user.username} 👋` : ""}
      </span>
      {/*<Separator orientation="vertical" className="h-4" />
      <span className="text-lg text-muted-foreground">{pageTitle}</span>*/}
    </div>
  );
}
