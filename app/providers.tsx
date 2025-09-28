"use client";

import { useEffect } from "react";
import MainNavbar from "@/components/navbar-components/main-navbar";
import Footer from "@/components/blocks/footer";

import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/use-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const supabase = createClient();
const queryClient = new QueryClient();

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

        // kalau user sudah ada di store → skip
        if (user) return;

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!authUser) {
          setUser(null);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          username: profile?.username ?? null,
          role: profile?.role ?? null,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal ambil user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      } else {
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      {showNavbar && <Footer />}
    </>
  );
}
