"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePathname, useRouter } from "next/navigation";

interface CategoryFilterProps {
  tags: string[];
  selectedTag: string;
}

export function CategoryFilter({ tags, selectedTag }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    if (tag !== "Semua Kategori") {
      params.set("tag", tag);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const DesktopTagFilter = () => (
    <div className="hidden md:flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`h-8 flex items-center px-3 rounded-lg cursor-pointer border text-sm transition-colors ${
            selectedTag === tag
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          }`}
        >
          <span>{tag}</span>
        </button>
      ))}
    </div>
  );

  const MobileTagFilter = () => (
    <Drawer>
      <DrawerTrigger
        className="md:hidden w-full flex items-center"
        render={<Button variant="outline" />}
      >
        <span className="capitalize text-sm font-medium">{selectedTag}</span>
      </DrawerTrigger>

      <DrawerPopup className="md:hidden pb-4" showBar>
        <DrawerHeader>
          <DrawerTitle>Pilih Kategoti Berita</DrawerTitle>
          <DrawerDescription>
            Silahkan pilih kategori yang ingin difilter
          </DrawerDescription>
        </DrawerHeader>

        <DrawerPanel className="max-h-[300px] ">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`h-8 flex items-center px-3 rounded-lg cursor-pointer border text-sm transition-colors ${
                  selectedTag === tag
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );

  return (
    <>
      <DesktopTagFilter />
      <MobileTagFilter />
    </>
  );
}
