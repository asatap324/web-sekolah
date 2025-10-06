import ThemeToggleButton from "@/components/dark-mode/theme-toggle-button";
import { AppSidebar } from "@/components/dashboard-ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
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
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center w-full justify-between gap-2 px-4">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1 size-5" />
              <Separator
                orientation="vertical"
                className="mr-3.5 data-[orientation=vertical]:h-4"
              />
              <span className="text-xl font-medium mr-2">Overview</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggleButton />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
