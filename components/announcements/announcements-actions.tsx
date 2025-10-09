"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementActionsProps } from "./types";

export function AnnouncementActions({
  expiredCount,
  selectedCount,
  onDeleteExpired,
  onBulkDelete,
  bulkDeleteLoading,
}: AnnouncementActionsProps) {
  return (
    <div className="flex flex-row gap-2">
      {expiredCount > 0 && (
        <Button
          variant="outline"
          onClick={onDeleteExpired}
          disabled={bulkDeleteLoading}
          className="h-8 w-fit md:w-full cursor-pointer"
        >
          {bulkDeleteLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Hapus yang Kedaluwarsa ({expiredCount})
        </Button>
      )}

      {selectedCount > 0 && (
        <Button
          variant="destructive"
          onClick={onBulkDelete}
          disabled={bulkDeleteLoading}
          className="h-8 cursor-pointer w-fit md:w-full"
        >
          {bulkDeleteLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Hapus {selectedCount} Terpilih
        </Button>
      )}
    </div>
  );
}
