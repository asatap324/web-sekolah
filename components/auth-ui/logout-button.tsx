"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PropsButton {
  size?: any | "default";
  variant?: any;
  className?: string;
}

export function LogoutButton({ size, variant, className }: PropsButton) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      className={cn("", className)}
      size={size}
      variant={variant}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
