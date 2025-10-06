// components/providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user-types";

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

const AuthContext = createContext<ReturnType<typeof useUser> | undefined>(
  undefined,
);

const supabase = createClient();

export default function AuthProvider({
  initialUser,
  children,
}: AuthProviderProps) {
  const queryClient = useQueryClient();

  // ✅ Tambahkan state untuk force re-render
  const [authVersion, setAuthVersion] = useState(0);

  // ✅ Pass authVersion ke useUser untuk trigger refetch
  const userData = useUser(initialUser, authVersion);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (
        event === "SIGNED_OUT" ||
        event === "SIGNED_IN" ||
        event === "USER_UPDATED"
      ) {
        // ✅ 1. Invalidate cache
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // ✅ 2. Force immediate re-render
        setAuthVersion((prev) => prev + 1);

        // ✅ 3. Untuk SIGNED_IN, langsung set user data
        if (event === "SIGNED_IN" && session?.user) {
          // Optional: Prefetch user data untuk immediate update
          queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: async () => {
              const { data: profile } = await supabase
                .from("profiles")
                .select("username, role")
                .eq("id", session.user.id)
                .maybeSingle();

              return {
                id: session.user.id,
                email: session.user.email ?? "",
                username: profile?.username ?? null,
                role: profile?.role ?? null,
              };
            },
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
