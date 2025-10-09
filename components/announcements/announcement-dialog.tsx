"use client";

import { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Announcement } from "@/app/actions/announcements/announcement";
import Image from "next/image";

interface AnnouncementDialogProps {
  announcements: Announcement[];
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementDialog({
  announcements,
  isOpen,
  onClose,
}: AnnouncementDialogProps) {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const currentAnnouncement = announcements[currentAnnouncementIndex];

  useEffect(() => {
    setCurrentAnnouncementIndex(0);
  }, [announcements]);

  const handleNext = () => {
    if (currentAnnouncementIndex < announcements.length - 1) {
      setCurrentAnnouncementIndex((prev) => prev + 1);
      setImageLoading(true);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentAnnouncementIndex > 0) {
      setCurrentAnnouncementIndex((prev) => prev - 1);
      setImageLoading(true);
    }
  };

  const handleClose = () => {
    announcements.forEach((announcement) => {
      localStorage.setItem(`announcement_${announcement.id}_read`, "true");
    });
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-200";
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      default:
        return "border-blue-200";
    }
  };

  const renderContent = () => {
    if (!currentAnnouncement) return null;

    switch (currentAnnouncement.content_type) {
      case "image":
        return (
          <div className="space-y-4">
            <div className="relative aspect-video bg-background rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b border-border"></div>
                </div>
              )}
              <Image
                src={currentAnnouncement.image_url || "/placeholder-image.jpg"}
                alt={currentAnnouncement.title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
            {currentAnnouncement.content && (
              <p className="text-sm text-foreground text-center">
                {currentAnnouncement.content}
              </p>
            )}
          </div>
        );

      case "mixed":
        return (
          <div className="space-y-4">
            {currentAnnouncement.image_url && (
              <div className="relative aspect-video bg-background rounded-lg overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b border-border"></div>
                  </div>
                )}
                <Image
                  src={currentAnnouncement.image_url}
                  alt={currentAnnouncement.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
            )}
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: formatContent(currentAnnouncement.content),
              }}
            />
          </div>
        );

      default: // text
        return (
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: formatContent(currentAnnouncement.content),
            }}
          />
        );
    }
  };

  if (!currentAnnouncement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className={`border-b pb-4 `}>
          <div className="flex items-start gap-2">
            <DialogTitle className="text-lg font-semibold">
              {currentAnnouncement.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-foreground mt-2 flex items-center gap-2">
            {formatDate(currentAnnouncement.created_at)}
            {currentAnnouncement.priority === 3 && (
              <Badge variant="outline" className="gap-1.5">
                <span
                  className="size-1.5 rounded-full bg-red-500"
                  aria-hidden="true"
                ></span>
                Penting
              </Badge>
            )}
            {currentAnnouncement.content_type !== "text" && (
              <Badge variant="outline" className="gap-1.5">
                {currentAnnouncement.content_type === "image"
                  ? "Gambar"
                  : "Campuran"}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-y-auto text-foreground">
          {renderContent()}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {announcements.length > 1 &&
              `${currentAnnouncementIndex + 1} dari ${announcements.length}`}
          </div>

          <div className="flex gap-2">
            {announcements.length > 1 && currentAnnouncementIndex > 0 && (
              <Button
                className="h-8 cursor-pointer"
                variant="outline"
                onClick={handlePrevious}
              >
                Sebelumnya
              </Button>
            )}

            <Button className="h-8 cursor-pointer" onClick={handleNext}>
              {currentAnnouncementIndex < announcements.length - 1
                ? "Lanjut"
                : "Mengerti"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatContent(content: string): string {
  return content.replace(/\n/g, "<br>");
}
