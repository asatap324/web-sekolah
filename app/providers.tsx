"use client";

import { useEffect } from "react";
import MainNavbar from "@/components/navbar-components/main-navbar";
import { usePathname } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavbarRoutes = [
    "/auth/login",
    "/auth/register",
    "/complete-profile",
    "/auth/signup-success",
    "/auth/reset-password",
    "/dashboard",
  ];

  // Cek apakah path termasuk dalam noNavbarRoutes
  const isExactMatch = noNavbarRoutes.includes(pathname);

  const isPreviewPage = pathname.includes("/preview");

  // Cek apakah path mengandung prefix tertentu (dynamic route)
  const isDashboard = pathname.startsWith("/dashboard/") && !isPreviewPage;

  const showNavbar = !(isExactMatch || isDashboard);

  return (
    <>
      {showNavbar && <MainNavbar />}
      {children}
    </>
  );
}
