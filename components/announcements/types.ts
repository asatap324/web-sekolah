import { Announcement } from "@/app/actions/announcements/announcement";

export type ViewMode = "all" | "active" | "expired" | "scheduled";

export interface AnnouncementFormData {
  title: string;
  content: string;
  content_type: string;
  active: boolean;
  type: string;
  priority: number;
  start_date: string;
  end_date: string;
}

export interface AnnouncementManagerProps {
  initialAnnouncements: Announcement[];
}

export interface AnnouncementListProps {
  announcements: Announcement[];
  viewMode: ViewMode;
  selectedAnnouncements: string[];
  onSelectAnnouncement: (id: string) => void;
  onSelectAll: () => void;
  onDeleteAnnouncement: (id: string) => void;
  deleteLoading: string | null;
}

export interface AnnouncementItemProps {
  announcement: Announcement;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export interface AnnouncementFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  totalCount: number;
  filteredCount: number;
}

export interface AnnouncementActionsProps {
  expiredCount: number;
  selectedCount: number;
  onDeleteExpired: () => void;
  onBulkDelete: () => void;
  bulkDeleteLoading: boolean;
}
