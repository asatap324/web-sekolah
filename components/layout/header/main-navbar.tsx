// components/navbar/main-navbar.tsx
"use client";

import { motion } from "motion/react";

import { MobileNavbar } from "./mobile-navbar";
import { NavbarContent } from "./nav-desktop";
import {
  AuthSection,
  ThemeToggle,
  SearchBar,
  Logo,
} from "@/components/layout/header/shared";

import { useNavbarScroll } from "./hooks/use-scroll";
import { navbarVariants } from "./types/navbar-variants";

export function MainNavbar() {
  const { isHidden } = useNavbarScroll();

  return (
    <motion.header
      className="border-b px-4 md:px-6 fixed top-0 left-0 right-0 z-50 bg-sidebar"
      variants={navbarVariants}
      animate={isHidden ? "hidden" : "visible"}
    >
      {/* Top Section */}
      <div className="flex max-w-8xl mx-auto h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        {/* Middle area */}
        <div className="grow">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:flex">
            <AuthSection variant="desktop" />
          </div>
          <ThemeToggle />
          <MobileNavbar />
        </div>
      </div>

      {/* Bottom Navigation (Desktop) */}
      <NavbarContent />
    </motion.header>
  );
}
