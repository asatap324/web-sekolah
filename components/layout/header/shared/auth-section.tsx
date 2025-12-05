// components/navbar/auth-section.tsx
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth";
import { UserDropdown } from "@/components/layout/header/shared";
import Link from "next/link";
// import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/hooks/use-user";

interface AuthSectionProps {
  variant?: "desktop" | "mobile";
}

export const AuthSection = ({ variant = "desktop" }: AuthSectionProps) => {
  const { user } = useUser();

  if (variant === "mobile") {
    return user ? (
      <LogoutButton className="w-full" redirectPath="/" />
    ) : (
      <Button
        variant="outline"
        className="w-full cursor-pointer h-8"
        render={<Link href="/auth/login" />}
      >
        Login
      </Button>
    );
  }

  return user ? (
    <div className="flex items-center gap-3.5">
      <LogoutButton variant="outline" redirectPath="/" />
      <UserDropdown
        username={user.username}
        email={user.email}
        userID={user.id}
      />
    </div>
  ) : (
    <Button variant="outline" render={<Link href="/auth/login" />}>
      Login
    </Button>
  );
};
