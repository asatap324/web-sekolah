import { AuthSection } from "@/components/layout/header/shared";
import type { SimpleLink } from "@/components/layout/header/types/navigation";
import { navigationLinks } from "@/components/layout/header/types/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/providers/auth-provider";
import { IconMenu } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const MobileNavbar = () => {
  const { user } = useAuth();

  return (
    <Drawer>
      <DrawerTrigger
        className="group size-8 text-foreground rounded-md md:hidden hover:bg-transparent hover:text-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="toggle-navigation"
      >
        <IconMenu aria-hidden="true" />
      </DrawerTrigger>
      <DrawerPopup className="md:hidden" showBar>
        <DrawerHeader className="text-start">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>
            Silahkan pilih menu yang ingin diakses
          </DrawerDescription>
        </DrawerHeader>
        <>
          <NavigationMenu className="max-w-none *:w-full pb-2 px-4">
            <NavigationMenuList className="flex flex-col items-start  md:gap-2">
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
                              rel={
                                item.blank ? "noopener noreferrer" : undefined
                              }
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
                        <NavigationMenuLink
                          href="/dashboard"
                          className="py-1.5"
                        >
                          Dashboard
                        </NavigationMenuLink>
                      )}
                    </>
                  )}
                  {index < navigationLinks.length - 1 && <Separator />}
                </NavigationMenuItem>
              ))}
              <Separator />
            </NavigationMenuList>
          </NavigationMenu>
        </>
        <DrawerFooter className="w-full">
          <AuthSection variant="mobile" />
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  );
};

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
