"use client";

import { useEffect } from "react";
import MainNavbar from "@/components/navbar-components/main-navbar";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/use-store";

const supabase = createClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setUser, setLoading, setError } = useUserStore();

  const noNavbarRoutes = [
    "/auth/login",
    "/auth/register",
    "/complete-profile",
    "/auth/signup-success",
    "/auth/reset-password",
    "/dashboard",
  ];

  const isExactMatch = noNavbarRoutes.includes(pathname);
  const isPreviewPage = pathname.includes("/preview");
  const isDashboard = pathname.startsWith("/dashboard/") && !isPreviewPage;

  const showNavbar = !(isExactMatch || isDashboard);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // ⛔ kalau user sudah ada di store → skip fetch
        if (user) return;

        // Ambil user dari auth
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!authUser) {
          setUser(null);
          return;
        }

        // Ambil profile dari table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", authUser.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          username: profile?.username,
          role: profile?.role,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal ambil user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listener untuk login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // logout
        setUser(null);
      } else {
        // login → fetch ulang
        loadUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, setUser, setLoading, setError]);

  return (
    <>
      {showNavbar && <MainNavbar />}
      {children}
    </>
  );
}
