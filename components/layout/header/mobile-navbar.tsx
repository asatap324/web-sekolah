// components/navbar/mobile-navbar.tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/animate-ui/components/radix/popover";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navigationLinks } from "@/components/layout/header/types/navigation";
import type {
  SimpleLink,
  NavGroup,
} from "@/components/layout/header/types/navigation";
import { AuthSection } from "@/components/layout/header/shared";
// import { useAuth } from "../../providers/auth-provider";
import { useUser } from "@/hooks/use-user";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const MobileNavbar = () => {
  const { user } = useUser();
  // console.log(user);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group size-8 md:hidden"
          variant="outline"
          size="icon"
          aria-label="toggle-navigation"
        >
          <MobileMenuIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 mt-3.5 p-1 md:hidden">
        <NavigationMenu className="max-w-none *:w-full pb-2">
          <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
            {user && <UserInfo user={user} />}
            {navigationLinks.map((link, index) => (
              <NavigationMenuItem key={index} className="w-full">
                {"submenu" in link && link.submenu ? (
                  <>
                    <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                      {link.label}
                    </div>
                    <ul>
                      {link.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <NavigationMenuLink
                            href={item.href}
                            className="py-1.5"
                            target={item.blank ? "_blank" : undefined}
                            rel={item.blank ? "noopener noreferrer" : undefined}
                          >
                            <div className="flex gap-2 items-center">
                              {item.label}
                              {item.comingSoon && (
                                <span className="h-4 w-fit px-3 text-xs font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <NavigationMenuLink
                      href={(link as SimpleLink).href}
                      className="py-1.5"
                    >
                      {(link as SimpleLink).label}
                    </NavigationMenuLink>
                    {user?.role === "admin" && (
                      <NavigationMenuLink href="/dashboard" className="py-1.5">
                        Dashboard
                      </NavigationMenuLink>
                    )}
                  </>
                )}
                {index < navigationLinks.length - 1 && <Separator />}
              </NavigationMenuItem>
            ))}
            <Separator />
            <NavigationMenuItem className="w-full px-1 py-1.5">
              <AuthSection variant="mobile" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
};

const MobileMenuIcon = () => (
  <svg
    className="pointer-events-none"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

const UserInfo = ({ user }: { user: any }) => (
  <>
    <NavigationMenuItem className="w-full flex justify-between items-center py-1.5 px-2">
      <div className="flex items-center gap-3 py-1.5 px-2 shrink">
        <Avatar className="shrink">
          <AvatarFallback>
            {user.username
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <div className="items-center flex gap-3">
            <span className="text-foreground truncate text-sm font-medium">
              {user.username}
            </span>
            {/*<span className="h-4 w-fit px-4 capitalize text-xs font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center">
              {user.role}
            </span>*/}
          </div>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        render={<Link href={`/user/profile/${user.id}`} />}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Profile</span>
      </Button>
    </NavigationMenuItem>
    <Separator />
  </>
);

const Separator = () => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className="bg-border -mx-1 my-1 h-px w-full"
  />
);
