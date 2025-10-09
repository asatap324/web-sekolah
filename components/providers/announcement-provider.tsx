"use client";

import { useEffect, useState } from "react";
import { AnnouncementDialog } from "@/components/announcements/announcement-dialog";
import { Announcement } from "@/app/actions/announcements/announcement";

interface AnnouncementProviderProps {
  announcements: Announcement[];
}

export function AnnouncementProvider({
  announcements,
}: AnnouncementProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<
    Announcement[]
  >([]);

  useEffect(() => {
    if (announcements.length > 0) {
      // Filter announcements yang belum dibaca
      const unreadAnnouncements = announcements.filter((announcement) => {
        const isRead = localStorage.getItem(
          `announcement_${announcement.id}_read`,
        );
        return !isRead;
      });

      setFilteredAnnouncements(unreadAnnouncements);

      // Auto-buka dialog jika ada announcements baru
      if (unreadAnnouncements.length > 0) {
        // Tunggu sebentar sebelum show dialog
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [announcements]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (filteredAnnouncements.length === 0) return null;

  return (
    <AnnouncementDialog
      announcements={filteredAnnouncements}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}
