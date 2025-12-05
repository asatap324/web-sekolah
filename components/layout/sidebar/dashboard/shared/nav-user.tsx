"use client";
import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  HouseIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/use-user";

import { useLogout } from "@/hooks/use-logout";
import Link from "next/link";

export function NavUser() {
  const { user } = useUser();
  const { isLoading, handleLogout } = useLogout();

  const handleUserLogout = async () => {
    const result = await handleLogout({
      redirectPath: "/auth/login",
      showToast: true,
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          render={<Avatar className="size-12 rounded-full" />}
        >
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Profile image"
            className="rounded-full"
          />
          <AvatarFallback>KK</AvatarFallback>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.username}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HouseIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Beranda</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Profile Ku</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUserLogout} disabled={isLoading}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
