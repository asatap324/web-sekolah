"use client";

import { AnnouncementListProps } from "./types";
import AnnouncementItem from "./announcement-item";

export function AnnouncementList({
  announcements,
  viewMode,
  selectedAnnouncements,
  onSelectAnnouncement,
  onSelectAll,
  onDeleteAnnouncement,
  deleteLoading,
}: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {viewMode === "expired"
          ? "Tidak ada pengumuman yang kedaluwarsa"
          : "Belum ada pengumuman"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementItem
          key={announcement.id}
          announcement={announcement}
          isSelected={selectedAnnouncements.includes(announcement.id)}
          onSelect={() => onSelectAnnouncement(announcement.id)}
          onDelete={() => onDeleteAnnouncement(announcement.id)}
          isDeleting={deleteLoading === announcement.id}
        />
      ))}
    </div>
  );
}
