// import { createServer } from "@/utils/supabase/server";
import { getAllAnnouncements } from "@/app/actions/announcements/announcement-admin";
import { AnnouncementManager } from "@/components/announcements/announcement-manager";

export default async function Page() {
  // ✅ GET ALL ANNOUNCEMENTS (INCLUDING EXPIRED)
  const announcementsResult = await getAllAnnouncements();

  if (!announcementsResult.success) {
    console.error("Failed to fetch announcements:", announcementsResult.error);
  }

  const announcements = announcementsResult.success
    ? announcementsResult.data
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <AnnouncementManager initialAnnouncements={announcements} />
    </div>
  );
}
