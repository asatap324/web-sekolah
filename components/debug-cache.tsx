// components/debug-cache.tsx (untuk testing)
"use client";

import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

export function DebugCache() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // console.log("User data:", user);
    console.log("Loading:", isLoading);
  }, [user, isLoading]);

  return null;
}
