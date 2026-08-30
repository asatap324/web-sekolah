import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { AppSidebar } from "@/components/layout";
import { ThemeToggle } from "@/components/layout/header/shared";

import { NavUser } from "@/components/layout/sidebar/dashboard/shared";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={true}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center h-fit justify-center">
            <SidebarTrigger className="size-5" />
          </div>
          <div className="flex items-center gap-3.5">
            <ThemeToggle />
            <NavUser />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
