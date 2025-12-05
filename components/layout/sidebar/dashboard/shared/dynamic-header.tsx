"use client";

import { useGreeting } from "../hooks/use-greeting";
import { useUser } from "@/hooks/use-user";
import { usePageTitle } from "../hooks/use-page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function DynamicHeader() {
  const greeting = useGreeting();
  const { user, isLoading } = useUser();
  const pageTitle = usePageTitle();

  if (isLoading) {
    return <Skeleton className="h-6 w-48" />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-medium mr-2">
        {greeting}
        {user?.username ? `, ${user.username} 👋` : ""}
      </span>
      {/*<Separator orientation="vertical" className="h-4" />
      <span className="text-lg text-muted-foreground">{pageTitle}</span>*/}
    </div>
  );
}
