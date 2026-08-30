// hooks/use-user.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user-types";

const fetchUser = async (): Promise<User | null> => {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  return res.json();
};

export function useUser(initialUser?: User | null) {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"], // ✅ Cache key
    queryFn: fetchUser,
    initialData: initialUser, // ✅ Instant data dari server
    staleTime: 1000 * 60 * 5, // ✅ 5 menit sebelum refetch
    gcTime: 1000 * 60 * 30, // ✅ 30 menit disimpan di cache
    retry: 1,
    refetchOnWindowFocus: false, // ✅ Hindari refetch tidak perlu
  });

  return {
    user: user || null,
    isLoading,
    refreshUser: refetch,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    hasProfile: !!(user?.username && user?.role),
    displayName: user?.username || user?.email?.split("@")[0] || "User",
  };
}
