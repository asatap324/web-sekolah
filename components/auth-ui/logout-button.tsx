// components/auth/simple-logout-button.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const supabase = createClient();

export function LogoutButton({
  variant = "outline",
  size = "sm",
  className = "",
  children = "Logout",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast.success("Logout berhasil");

      // ✅ Simple solution: refresh page untuk update semua state
      window.location.href = "/"; // Redirect ke home dengan full refresh
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout gagal");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("h-8 cursor-pointer", className)}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
          Logging out...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
