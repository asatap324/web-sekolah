// components/providers/layout-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { MainNavbar, Footer } from "@/components/layout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noNavbarRoutes = [
    "/auth/login",
    "/auth/register",
    "/dashboard",
    "/auth/forgot-password",
    "/auth/resend-verification",
    "/auth/reset-password/confirm",
    "/auth/verification-error",
    "/auth/verification-success",
  ];
  const isExactMatch = noNavbarRoutes.includes(pathname);
  const isPreviewPage = pathname.includes("/preview");
  const isDashboard = pathname.startsWith("/dashboard/") && !isPreviewPage;
  const showNavbar = !(isExactMatch || isDashboard);

  return (
    <>
      {showNavbar && <MainNavbar />}
      <main className={showNavbar ? "mt-16" : ""}>{children}</main>
      {showNavbar && <Footer />}
    </>
  );
}
