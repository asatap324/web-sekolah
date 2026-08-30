"use client";

import { TableOfContents } from "@/components/blog";
import {
  Drawer,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { List } from "lucide-react";

export function MobileTableOfContents() {
  return (
    <Drawer>
      <DrawerTrigger
        aria-label="Open Table of Contents"
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <List size={20} />
      </DrawerTrigger>

      <DrawerPopup className="lg:hidden">
        <DrawerHeader>
          <DrawerTitle className="font-semibold">Table of Contents</DrawerTitle>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <TableOfContents />
        </div>
      </DrawerPopup>
    </Drawer>
  );
}
