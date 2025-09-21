"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Announcement = {
  id: string;
  title: string;
  content: string;
};

export default function AnnouncementPopup({
  announcement,
}: {
  announcement: Announcement;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah lihat pengumuman ini
    const seen = localStorage.getItem(`seen_announcement_${announcement.id}`);
    if (!seen) {
      setOpen(true);
    }
  }, [announcement.id]);

  const handleClose = () => {
    localStorage.setItem(`seen_announcement_${announcement.id}`, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📢 {announcement.title}</DialogTitle>
          <DialogDescription>{announcement.content}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={handleClose}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
