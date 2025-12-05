// components/navbar/social-links.tsx
import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon, Gmail } from "@/components/social-icons/icons";

export const SocialLinks = () => {
  const socialLinks = [
    {
      href: "https://www.instagram.com/smpn4muncar_satuatap?utm_source=ig_web_button_share_sheet&igsh=NXRpZ280b2xoeTJv",
      icon: InstagramIcon,
      label: "Instagram",
      external: true,
    },
    {
      href: "mailto:smpn4muncar_satuatap@yahoo.com",
      icon: Gmail,
      label: "Email",
      external: true,
    },
    {
      href: "#!",
      icon: Phone,
      label: "(0333) 590094",
      external: false,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-muted-foreground">
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center gap-2"
        >
          <link.icon className="w-4 h-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
};
