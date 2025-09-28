"use client";
import { BookOpenIcon, InfoIcon } from "lucide-react";
import {
  IconUsers,
  IconLibraryPhoto,
  IconPlayHandball,
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import ThemeToggleButton from "@/components/dark-mode/theme-toggle-button";
import { LogoutButton } from "@/components/auth-ui/logout-button";
import Link from "next/link";
import SearchBar from "@/components/search/search-bar";
import { useUser } from "@/hooks/use-user";
import { Badge } from "../ui/badge";

import { navigationLinks } from "@/types/navigation";
import type { SimpleLink, NavGroup } from "@/types/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function MainNavbar() {
  const { user } = useUser();
  return (
    <header className="border-b px-4 md:px-6 fixed top-0 left-0 right-0 z-[9999] bg-background">
      <div className="flex max-w-8xl mx-auto h-16 items-center  justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="flex items-center text-primary hover:text-primary/90"
          >
            <Image
              src="/assets/logo-smp.png"
              className="w-[80px] h-auto shrink-0"
              alt="Logo"
              width={100}
              height={100}
            />
            {/*<span className="text-xs font-semibold hidden md:flex text-foreground">
              SMP Negeri 04 Muncar Satu Atap <br /> Muncar Banyuwangi
            </span>*/}
          </Link>
        </div>
        {/* Middle area */}
        <div className="grow">
          {/* Search form */}
          <SearchBar />
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:flex">
            {user?.role === "admin" ? (
              <div>
                <LogoutButton variant="outline" />
              </div>
            ) : (
              <Button variant="outline" className="cursor-pointer h-8" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
          <ThemeToggleButton />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="outline"
                size="icon"
                aria-label="toggle-navigation"
              >
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
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-64 mt-3.5  p-1 md:hidden"
            >
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
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
                                    item.blank
                                      ? "noopener noreferrer"
                                      : undefined
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
                      {/* Add separator between different types of items */}
                      {index < navigationLinks.length - 1 &&
                        // Separator rules
                        // case 1: current = simple, next = submenu
                        ((!("submenu" in link) &&
                          "submenu" in navigationLinks[index + 1]) ||
                          // case 2: current = submenu, next = simple
                          ("submenu" in link &&
                            !("submenu" in navigationLinks[index + 1])) ||
                          // case 3: both are submenu, but different type
                          ("submenu" in link &&
                            "submenu" in navigationLinks[index + 1] &&
                            (link as NavGroup).type !==
                              (navigationLinks[index + 1] as NavGroup)
                                .type)) && (
                          <div
                            role="separator"
                            aria-orientation="horizontal"
                            className="bg-border -mx-1 my-1 h-px w-full"
                          />
                        )}
                    </NavigationMenuItem>
                  ))}
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border -mx-1 my-1 mb-2 h-px w-full"
                  />
                  <NavigationMenuItem className="w-full px-1">
                    {user ? (
                      <LogoutButton className="w-full" />
                    ) : (
                      <Button
                        variant={"outline"}
                        className="w-full cursor-pointer h-8 "
                        asChild
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Bottom navigation */}

      <div className="border-t py-2 max-md:hidden ">
        {/* Navigation menu */}
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {"submenu" in link && link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="text-muted-foreground dark:bg-neutral-950 px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-64"
                                : "min-w-48",
                            )}
                          >
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink
                                  href={item.href}
                                  target={item.blank ? "_blank" : undefined}
                                  rel={
                                    item.blank
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="py-1.5"
                                >
                                  {/* Icon style */}
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2">
                                      {item.icon === "BookOpenIcon" && (
                                        <BookOpenIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "IconUsers" && (
                                        <IconUsers
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "InfoIcon" && (
                                        <InfoIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "IconLibraryPhoto" && (
                                        <IconLibraryPhoto
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "IconPlayHandball" && (
                                        <IconPlayHandball
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
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

                                  {/* Description style */}
                                  {link.type === "description" &&
                                  "description" in item ? (
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
                                  ) : (
                                    // Simple label
                                    !link.type ||
                                    (link.type !== "icon" &&
                                      link.type !== "description" && (
                                        <span className="flex items-center gap-2">
                                          {item.label}
                                          {item.comingSoon && (
                                            <span className="h-4 w-28 flex items-center justify-center px-3 text-xs font-medium bg-muted text-muted-foreground rounded-md border">
                                              Coming Soon
                                            </span>
                                          )}
                                        </span>
                                      ))
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
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
                            className="py-1.5 text-muted-foreground hover:text-primary font-medium"
                          >
                            Dashboard
                          </NavigationMenuLink>
                        )}
                      </div>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex flex-wrap gap-3 text-muted-foreground">
              <Link
                href="https://www.instagram.com/smpn4muncar_satuatap?utm_source=ig_web_button_share_sheet&igsh=NXRpZ280b2xoeTJv"
                target="_blank"
                className="h-6  w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center gap-2"
              >
                <IconBrandInstagram className="w-4 h-4" />
                <span>Instagram</span>
              </Link>
              <Link
                href="mailto:smpn4muncar_satuatap@yahoo.com"
                target="_blank"
                className="h-6  w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center gap-2"
              >
                <IconMail className="w-4 h-4" />
                <span>Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
