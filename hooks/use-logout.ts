// hooks/use-logout.ts
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (options?: {
    redirectPath?: string;
    showToast?: boolean;
  }) => {
    const { redirectPath = "/", showToast = true } = options || {};

    setIsLoading(true);

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

      setIsLoading(false);
      return { success: false, error };
    }
  };

  return {
    isLoading,
    handleLogout,
  };
}
