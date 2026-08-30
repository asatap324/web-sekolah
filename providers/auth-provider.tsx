"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user-types";
import { toast } from "sonner";

interface AuthContextValue {
  // User data (dari useUser)
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasProfile: boolean;
  displayName: string;
  refreshUser: () => void;
  // Logout (diserap dari useLogout)
  logout: (opts?: {
    redirectPath?: string;
    showToast?: boolean;
  }) => Promise<{ success: boolean }>;
  isLoggingOut: boolean;
}

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const supabase = createClient();

export default function AuthProvider({
  initialUser,
  children,
}: AuthProviderProps) {
  const queryClient = useQueryClient();

  // State untuk logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Ambil data user dari React Query (akan otomatis re-render jika data berubah)
  const userData = useUser(initialUser);

  // Logout handler — diserap dari hooks/use-logout.ts
  const logout = useCallback(
    async (options?: { redirectPath?: string; showToast?: boolean }) => {
      const { redirectPath = "/", showToast = true } = options || {};

      setIsLoggingOut(true);

      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        if (showToast) {
          toast.success("Logout berhasil");
        }

        // Redirect setelah logout
        if (redirectPath) {
          window.location.href = redirectPath;
        }

        return { success: true };
      } catch (error) {
        console.error("Logout error:", error);

        if (showToast) {
          toast.error("Logout gagal");
        }

        setIsLoggingOut(false);
        return { success: false };
      }
    },
    [],
  );

  const value: AuthContextValue = {
    ...userData,
    logout,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
