// hooks/use-auth.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  username: string | null;
  role: string | null;
}

const fetchUser = async (): Promise<User | null> => {
  const res = await fetch("/api/auth/user");
  if (!res.ok) return null;
  return res.json();
};

export function useUser(initialUser?: User | null, authVersion?: number) {
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

  //  ✅ Manual refresh jika needed
  // const refreshUser = () => {
  //   queryClient.invalidateQueries({ queryKey: ["user"] });
  // };

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
