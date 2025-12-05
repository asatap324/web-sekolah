// components/navbar/navbar-content.tsx
import { NavbarItems, SocialLinks } from "@/components/layout/header/shared";

export const NavbarContent = () => {
  return (
    <div className="border-t py-2 max-md:hidden">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between">
          <NavbarItems />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};
