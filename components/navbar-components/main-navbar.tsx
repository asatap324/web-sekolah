import { BookOpenIcon, InfoIcon } from "lucide-react";
import {
  IconUsers,
  IconLibraryPhoto,
  IconPlayHandball,
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
import ThemeToggleButton from "../dark-mode/theme-toggle-button";
import { LogoutButton } from "../auth-ui/logout-button";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import SearchBar from "../search/search-bar";
import { useEffect, useId, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", label: "Home" },
  {
    label: "Tentang Sekolah Kami",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "Profile Sekolah",
        description: "Lebih tahu tentang sekolah kami",
      },
      {
        href: "#",
        label: "Visi Misi",
        description: "Liat Visi dan Misi sekolah kami",
      },
      {
        href: "#",
        label: "PPDB Online",
        description: "Daftarkan anak anda di sekolah kami",
      },
    ],
  },
  {
    label: "Informasi Sekolah",
    submenu: true,
    type: "icon",
    items: [
      { href: "#", label: "Berita & Artikel", icon: "BookOpenIcon" },
      { href: "#", label: "Daftar Guru", icon: "IconUsers" },
      { href: "#", label: "Gallery", icon: "IconLibraryPhoto" },
      { href: "#", label: "Ekstrakulikuler", icon: "IconPlayHandball" },
    ],
  },
  {
    label: "Lainnya",
    submenu: true,
    type: "icon",
    items: [{ href: "#", label: "Pengumuman", icon: "InfoIcon" }],
  },
];

const supabase = createClient();

export default function MainNavbar() {
  const id = useId();
  const { user, loading } = useUser();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil role saat mount
    const getRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setRole(null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role ?? null);
    };

    getRole();

    // Listen perubahan login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getRole();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="border-b px-4 md:px-6 fixed top-0 left-0 right-0 z-[9999] bg-background">
      <div className="flex max-w-8xl mx-auto h-16 items-center  justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center">
          <Link
            href="#"
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
            {user ? (
              <div>
                <LogoutButton />
              </div>
            ) : (
              <Button asChild>
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
                      {link.submenu ? (
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
                                >
                                  {item.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <NavigationMenuLink
                            href={link.href}
                            className="py-1.5"
                          >
                            {link.label}
                          </NavigationMenuLink>
                          {role === "admin" && (
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
                        // Show separator if:
                        // 1. One is submenu and one is simple link OR
                        // 2. Both are submenus but with different types
                        ((!link.submenu &&
                          navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            !navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            navigationLinks[index + 1].submenu &&
                            link.type !== navigationLinks[index + 1].type)) && (
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
                      <LogoutButton className="w-full" variant="destructive" />
                    ) : (
                      <Button className="w-full" asChild>
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
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {link.submenu ? (
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
                                className="py-1.5"
                              >
                                {/* Display icon if present */}
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
                                    <span>{item.label}</span>
                                  </div>
                                )}

                                {/* Display label with description if present */}
                                {link.type === "description" &&
                                "description" in item ? (
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      {item.label}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-xs">
                                      {item.description}
                                    </p>
                                  </div>
                                ) : (
                                  // Display simple label if not icon or description type
                                  !link.type ||
                                  (link.type !== "icon" &&
                                    link.type !== "description" && (
                                      <span>{item.label}</span>
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
                        href={link.href}
                        className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      >
                        {link.label}
                      </NavigationMenuLink>
                      {role === "admin" && (
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
        </div>
      </div>
    </header>
  );
}
