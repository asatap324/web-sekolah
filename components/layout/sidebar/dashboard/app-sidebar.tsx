"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  CalendarCheck,
  Command,
  CreditCard,
  FolderOpen,
  HouseIcon,
  LifeBuoy,
  Newspaper,
  PenIcon,
  Send,
  Settings,
  UserSquare2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar";
import { NavUser } from "@/components/layout/sidebar/dashboard/shared";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: HouseIcon,
          isActive: true,
        },
        {
          title: "Buat Berita",
          icon: Newspaper,
          url: "/dashboard/create-blog",
        },
        {
          title: "Tutorial Buat Berita",
          icon: PenIcon,
          url: "/dashboard/create-blog",
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Dashboard</span>
                  <span className="truncate text-xs">
                    SMP Negeri 04 Muncar Satu Atap
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="default"
                      asChild
                      isActive={item.isActive}
                      tooltip={item.title}
                    >
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
