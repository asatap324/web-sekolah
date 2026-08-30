import { LogoutButton } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";

interface AuthSectionProps {
  variant?: "desktop" | "mobile";
}

export const AuthSection = ({ variant = "desktop" }: AuthSectionProps) => {
  const { user } = useAuth();

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
      <LogoutButton variant="ghost" redirectPath="/" />
      <UserDropdown
        username={user.username}
        email={user.email}
        userID={user.id}
      />
    </div>
  ) : (
    <Button variant="default" render={<Link href="/auth/login" />}>
      Login
    </Button>
  );
};
