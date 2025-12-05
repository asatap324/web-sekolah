"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="toggle theme"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative cursor-pointer size-8"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
