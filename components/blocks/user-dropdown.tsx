import { CircleUserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserDropdown({
  username,
  email,
  role,
}: {
  username: string | null;
  email: string;
  role: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-8 cursor-pointer "
          size="icon"
          variant="outline"
          aria-label="Open account menu"
        >
          <CircleUserRoundIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 z-50 border-none">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="shrink-0">
            <AvatarFallback>
              {username
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <div className="items-center flex gap-3.5">
              <span className="text-foreground truncate text-sm font-medium">
                {username}
              </span>
              <span className="h-4 w-fit px-4 capitalize text-xs font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center">
                {role}
              </span>
            </div>

            <span className="text-muted-foreground truncate text-xs font-normal">
              {email}
            </span>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
