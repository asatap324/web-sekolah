"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Announcement } from "@/app/actions/announcements/announcement";
import {
  deleteAnnouncement,
  deleteExpiredAnnouncements,
  bulkDeleteAnnouncements,
} from "@/app/actions/announcements/announcement-admin";
import { AnnouncementManagerProps, ViewMode } from "./types";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementList } from "./announcement-lists";
import { AnnouncementFilters } from "./announcement-filters";
import { AnnouncementActions } from "./announcements-actions";
import { toast } from "sonner";

export function AnnouncementManager({
  initialAnnouncements,
}: AnnouncementManagerProps) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>(
    [],
  );
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Helper functions
  const isExpired = (announcement: Announcement) => {
    const now = new Date();
    const endDate = announcement.end_date
      ? new Date(announcement.end_date)
      : null;
    return endDate && endDate < now;
  };

  const isScheduled = (announcement: Announcement) => {
    const now = new Date();
    const startDate = announcement.start_date
      ? new Date(announcement.start_date)
      : null;
    return startDate && startDate > now;
  };

  const isActive = (announcement: Announcement) => {
    const now = new Date();
    const startDate = announcement.start_date
      ? new Date(announcement.start_date)
      : null;
    const endDate = announcement.end_date
      ? new Date(announcement.end_date)
      : null;

    return (
      announcement.active &&
      (!startDate || startDate <= now) &&
      (!endDate || endDate >= now)
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const expired = isExpired(announcement);
    const scheduled = isScheduled(announcement);
    const active = isActive(announcement);

    switch (viewMode) {
      case "active":
        return announcement.active && !expired;
      case "expired":
        return expired;
      case "scheduled":
        return scheduled;
      default:
        return true;
    }
  });

  const expiredAnnouncements = announcements.filter(isExpired);

  // Event handlers
  const handleAnnouncementCreated = (newAnnouncement: any) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      return;
    }

    setDeleteLoading(id);

    try {
      const result = await deleteAnnouncement(id);

      if (result.success) {
        setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
        setSelectedAnnouncements((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        );
        toast.success("Pengumuman berhasil dihapus!");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteExpired = async () => {
    if (expiredAnnouncements.length === 0) {
      toast.error("Tidak ada pengumuman yang kedaluwarsa");
      return;
    }

    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus ${expiredAnnouncements.length} pengumuman yang sudah kedaluwarsa?`,
      )
    ) {
      return;
    }

    setBulkDeleteLoading(true);

    try {
      const result = await deleteExpiredAnnouncements();

      if (result.success) {
        setAnnouncements((prev) => prev.filter((ann) => !isExpired(ann)));
        setSelectedAnnouncements([]);
        toast.success(
          result.message ||
            `Berhasil menghapus ${result.deletedCount} pengumuman kedaluwarsa`,
        );
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Delete expired error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAnnouncements.length === 0) {
      toast.info("Pilih pengumuman yang ingin dihapus");
      return;
    }

    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus ${selectedAnnouncements.length} pengumuman?`,
      )
    ) {
      return;
    }

    setBulkDeleteLoading(true);

    try {
      const result = await bulkDeleteAnnouncements(selectedAnnouncements);

      if (result.success) {
        setAnnouncements((prev) =>
          prev.filter((ann) => !selectedAnnouncements.includes(ann.id)),
        );
        setSelectedAnnouncements([]);
        toast.success(`Berhasil menghapus ${result.deletedCount} pengumuman`);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleSelectAnnouncement = (id: string) => {
    setSelectedAnnouncements((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAnnouncements.length === filteredAnnouncements.length) {
      setSelectedAnnouncements([]);
    } else {
      setSelectedAnnouncements(filteredAnnouncements.map((ann) => ann.id));
    }
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col  md:flex-row justify-between gap-6">
        <h2 className="text-2xl font-semibold">Daftar Pengumuman</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <AnnouncementActions
            expiredCount={expiredAnnouncements.length}
            selectedCount={selectedAnnouncements.length}
            onDeleteExpired={handleDeleteExpired}
            onBulkDelete={handleBulkDelete}
            bulkDeleteLoading={bulkDeleteLoading}
          />

          <AnnouncementForm
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onAnnouncementCreated={handleAnnouncementCreated}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-8 cursor-pointer w-fit md:w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengumuman
              </Button>
            </DialogTrigger>
          </AnnouncementForm>
        </div>
      </div>

      {/* Filters */}
      <AnnouncementFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedAnnouncements.length}
        totalCount={announcements.length}
        filteredCount={filteredAnnouncements.length}
      />

      {/* List */}
      <AnnouncementList
        announcements={filteredAnnouncements}
        viewMode={viewMode}
        selectedAnnouncements={selectedAnnouncements}
        onSelectAnnouncement={handleSelectAnnouncement}
        onSelectAll={handleSelectAll}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        deleteLoading={deleteLoading}
      />
    </div>
  );
}
