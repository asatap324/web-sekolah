"use client";

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnnouncementFiltersProps } from "./types";

export function AnnouncementFilters({
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCount,
  filteredCount,
}: AnnouncementFiltersProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-start">
        <Select value={viewMode} onValueChange={onViewModeChange}>
          <SelectTrigger className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="expired">Kedaluwarsa</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredCount} dari {totalCount}
        {selectedCount > 0 && ` • ${selectedCount} terpilih`}
      </div>
    </div>
  );
}
