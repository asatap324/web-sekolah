// components/SocialShareButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useShare } from "@/hooks/use-share";
import { Link } from "lucide-react";

import {
  Telegram,
  WhatsApp,
  XformerlyTwitter,
  LinkedIn,
  Facebook,
} from "@/components/social-icons/icons";

export function SocialShareButtons() {
  const { shareArticle, isCopied } = useShare();

  const buttons = [
    {
      platform: "twitter",
      icon: XformerlyTwitter,
      label: "Twitter",
      variant: "outline" as const,
    },
    {
      platform: "facebook",
      icon: Facebook,
      label: "Facebook",
      variant: "outline" as const,
    },
    {
      platform: "linkedin",
      icon: LinkedIn,
      label: "LinkedIn",
      variant: "outline" as const,
    },
    {
      platform: "whatsapp",
      icon: WhatsApp,
      label: "WhatsApp",
      variant: "outline" as const,
    },
    {
      platform: "telegram",
      icon: Telegram,
      label: "Telegram",
      variant: "outline" as const,
    },
    {
      platform: "copy",
      icon: Link,
      label: isCopied ? "Tersalin!" : "Salin Link",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((button) => {
        const IconComponent = button.icon;
        return (
          <Button
            key={button.platform}
            variant={button.variant}
            size="sm"
            onClick={() => shareArticle(button.platform)}
            className={`flex items-center gap-2`}
          >
            <IconComponent className="h-6 w-6" />
            <span className="">{button.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
