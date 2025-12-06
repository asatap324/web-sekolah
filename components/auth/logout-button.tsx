// components/auth/simple-logout-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useLogout } from "@/hooks/use-logout";

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
  const { isLoading, handleLogout } = useLogout();

  const onLogout = () => {
    handleLogout({ redirectPath, showToast });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("h-8 cursor-pointer", className)}
      onClick={onLogout}
      disabled={isLoading}
    >
      {isLoading ? (
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
