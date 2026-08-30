"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAuth } from "@/providers/auth-provider";

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
  redirectPath: string;
  showToast?: boolean;
}

export function LogoutButton({
  variant = "outline",
  size = "sm",
  className = "",
  children = "Logout",
  redirectPath = "/",
  showToast = true,
}: LogoutButtonProps) {
  const { isLoggingOut, logout } = useAuth();

  const onLogout = () => {
    logout({ redirectPath, showToast });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("h-8 cursor-pointer", className)}
      onClick={onLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Logging out...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
