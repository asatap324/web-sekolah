// components/navbar/navbar-items.tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { BookOpenIcon, InfoIcon } from "lucide-react";
import {
  IconUsers,
  IconLibraryPhoto,
  IconPlayHandball,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { navigationLinks } from "@/components/layout/header/types/navigation";
import type {
  SimpleLink,
  NavGroup,
} from "@/components/layout/header/types/navigation";
// import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/hooks/use-user";

interface NavbarItemsProps {
  viewport?: boolean;
}

export const NavbarItems = ({ viewport = false }: NavbarItemsProps) => {
  const { user } = useUser();

  const renderIcon = (iconName: string | undefined) => {
    const iconProps = {
      size: 16,
      className: "text-foreground opacity-60",
      "aria-hidden": "true" as const,
    };

    switch (iconName) {
      case "BookOpenIcon":
        return <BookOpenIcon {...iconProps} />;
      case "IconUsers":
        return <IconUsers {...iconProps} />;
      case "InfoIcon":
        return <InfoIcon {...iconProps} />;
      case "IconLibraryPhoto":
        return <IconLibraryPhoto {...iconProps} />;
      case "IconPlayHandball":
        return <IconPlayHandball {...iconProps} />;
      default:
        return null;
    }
  };

  const renderNavItem = (link: SimpleLink | NavGroup, index: number) => {
    if ("submenu" in link && link.submenu) {
      return (
        <NavigationMenuItem key={index}>
          <NavigationMenuTrigger className="text-muted-foreground bg-sidebar px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
            {link.label}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
            <ul
              className={cn(
                link.type === "description" ? "min-w-64" : "min-w-48",
              )}
            >
              {link.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <NavigationMenuLink
                    href={item.href}
                    target={item.blank ? "_blank" : undefined}
                    rel={item.blank ? "noopener noreferrer" : undefined}
                    className="py-1.5"
                  >
                    {link.type === "icon" && "icon" in item && (
                      <div className="flex items-center gap-2">
                        {renderIcon(item.icon)}
                        <div className="flex items-center gap-2">
                          <div>{item.label}</div>
                          {item.comingSoon && (
                            <span className="h-4 w-28 flex items-center justify-center px-3 text-xs font-medium bg-muted text-muted-foreground rounded-md border">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {link.type === "description" && "description" in item && (
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {item.label}
                          {item.comingSoon && (
                            <span className="h-4 w-28 flex items-center justify-center px-3 text-xs font-medium bg-muted text-muted-foreground rounded-md border">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {(!link.type ||
                      (link.type !== "icon" &&
                        link.type !== "description")) && (
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.comingSoon && (
                          <span className="h-4 w-28 flex items-center justify-center px-3 text-xs font-medium bg-muted text-muted-foreground rounded-md border">
                            Coming Soon
                          </span>
                        )}
                      </span>
                    )}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={index}>
        <div className="flex items-center">
          <NavigationMenuLink
            href={(link as SimpleLink).href}
            className="text-muted-foreground hover:text-primary py-1.5 font-medium"
          >
            {link.label}
          </NavigationMenuLink>
          {user?.role === "admin" && (
            <NavigationMenuLink
              href="/dashboard"
              className="py-1.5 text-muted-foreground hover:text-primary font-medium ml-4"
            >
              Dashboard
            </NavigationMenuLink>
          )}
        </div>
      </NavigationMenuItem>
    );
  };

  return (
    <NavigationMenu viewport={viewport}>
      <NavigationMenuList className="gap-2">
        {navigationLinks.map(renderNavItem)}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
