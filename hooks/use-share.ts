// hooks/useShare.ts
import { useState } from "react";

interface UseShareReturn {
  shareArticle: (platform: string) => Promise<void>;
  isLoading: boolean;
  isCopied: boolean;
}

export function useShare(): UseShareReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareArticle = async (platform: string = "default"): Promise<void> => {
    setIsLoading(true);

    try {
      const currentUrl = window.location.href;
      const title = document.title;
      const shareText = `Lihat artikel ini: ${title}`;

      await shareOnPlatform(platform, currentUrl, title, shareText);

      // Show copied feedback jika menggunakan copy link
      if (platform === "copy") {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareOnPlatform = async (
    platform: string,
    url: string,
    title: string,
    text: string,
  ): Promise<void> => {
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;

      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank",
        );
        break;

      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        );
        break;

      case "copy":
        await navigator.clipboard.writeText(url);
        break;

      default:
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: text,
            url: url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
    }
  };

  return {
    shareArticle,
    isLoading,
    isCopied,
  };
}
