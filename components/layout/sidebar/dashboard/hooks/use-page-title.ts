import { usePathname } from "next/navigation";

export function usePageTitle() {
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/analytics": "Analytics",
    "/dashboard/settings": "Settings",
    "/dashboard/profile": "Profile",
    // Tambahkan route lainnya
  };

  return pageTitles[pathname] || "Dashboard";
}
