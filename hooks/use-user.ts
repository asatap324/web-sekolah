"use client";

import { useUserStore } from "@/store/use-store";

export function useUser() {
  const { user, loading, error, setUser, setLoading, setError } =
    useUserStore();

  return {
    user,
    loading,
    error,
    setUser,
    setLoading,
    setError,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
  };
}
