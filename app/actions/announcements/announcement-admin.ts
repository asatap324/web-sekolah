"use server";

import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: {
  title: string;
  content: string;
  content_type: string;
  image_url: string;
  active: boolean;
  type: string;
  priority: number;
  start_date: string;
  end_date: string;
}) {
  try {
    const supabase = await createServer();

    // console.log("📝 Creating announcement with data:", formData);

    // ✅ VALIDATE REQUIRED FIELDS
    if (!formData.title.trim()) {
      return { success: false, error: "Judul tidak boleh kosong" };
    }

    if (formData.content_type === "text" && !formData.content.trim()) {
      return {
        success: false,
        error: "Konten tidak boleh kosong untuk jenis teks",
      };
    }

    if (formData.content_type === "image" && !formData.image_url) {
      return {
        success: false,
        error: "Gambar harus diupload untuk jenis gambar",
      };
    }

    // ✅ PREPARE DATA FOR INSERT
    const announcementData: any = {
      title: formData.title.trim(),
      content: formData.content.trim() || "",
      content_type: formData.content_type || "text",
      active: formData.active !== undefined ? formData.active : true,
      type: formData.type,
      priority: formData.priority,
      start_date: formData.start_date, // ✅ Sudah diformat di component
      end_date: formData.end_date, // ✅ Sudah diformat di component
    };

    // ✅ ONLY ADD IMAGE_URL IF IT EXISTS
    if (formData.image_url) {
      announcementData.image_url = formData.image_url;
    }

    // console.log("📦 Prepared data for insert:", announcementData);

    const { data, error } = await supabase
      .from("announcements")
      .insert([announcementData])
      .select()
      .maybeSingle();

    if (error) {
      // console.error("❌ Create announcement error:", error);
      // console.error("Error details:", error.details, error.hint, error.message);

      // ✅ USER-FRIENDLY ERROR MESSAGES
      let errorMessage = "Gagal membuat pengumuman";
      if (error.message.includes("violates not-null constraint")) {
        errorMessage =
          "Data tidak lengkap. Pastikan semua field required terisi.";
      } else if (error.message.includes("violates unique constraint")) {
        errorMessage = "Judul pengumuman sudah ada.";
      } else if (error.message.includes("foreign key constraint")) {
        errorMessage = "Terjadi kesalahan referensi data.";
      }

      return { success: false, error: errorMessage };
    }

    // console.log("✅ Announcement created successfully:", data);

    revalidatePath("/");
    revalidatePath("/dashboard/announcements");

    return { success: true, data };
  } catch (error) {
    // console.error("❌ Unexpected error in createAnnouncement:", error);
    return {
      success: false,
      error: "Terjadi kesalahan sistem yang tidak terduga",
    };
  }
}
export async function getAllAnnouncements() {
  try {
    const supabase = await createServer();

    const { data: announcements, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all announcements:", error);
      return {
        success: false,
        error: "Gagal mengambil data pengumuman",
        data: [],
      };
    }

    return { success: true, data: announcements || [] };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan sistem", data: [] };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const supabase = await createServer();

    console.log("🗑️ Deleting announcement:", id);

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete announcement error:", error);
      return { success: false, error: "Gagal menghapus pengumuman" };
    }

    console.log("✅ Announcement deleted successfully");

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan sistem" };
  }
}

export async function deleteExpiredAnnouncements() {
  try {
    const supabase = await createServer();
    const now = new Date().toISOString();

    console.log("🕒 Deleting expired announcements...");

    // Hapus pengumuman yang end_date sudah lewat dan active = true
    const { data: expiredAnnouncements, error: fetchError } = await supabase
      .from("announcements")
      .select("id, title, end_date")
      .lt("end_date", now)
      .eq("active", true);

    if (fetchError) {
      console.error("Error fetching expired announcements:", fetchError);
      return {
        success: false,
        error: "Gagal mengambil data pengumuman kedaluwarsa",
        deletedCount: 0,
      };
    }

    if (!expiredAnnouncements || expiredAnnouncements.length === 0) {
      console.log("✅ No expired announcements found");
      return {
        success: true,
        deletedCount: 0,
        message: "Tidak ada pengumuman yang kedaluwarsa",
      };
    }

    console.log(
      `📋 Found ${expiredAnnouncements.length} expired announcements:`,
      expiredAnnouncements,
    );

    // Hapus satu per satu atau dalam batch
    const deletePromises = expiredAnnouncements.map(async (announcement) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcement.id);

      if (error) {
        console.error(
          `❌ Failed to delete announcement ${announcement.id}:`,
          error,
        );
        return { success: false, id: announcement.id };
      }

      console.log(`✅ Deleted expired announcement: ${announcement.title}`);
      return { success: true, id: announcement.id };
    });

    const results = await Promise.all(deletePromises);
    const successfulDeletes = results.filter((result) => result.success).length;

    console.log(
      `🎯 Successfully deleted ${successfulDeletes} expired announcements`,
    );

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return {
      success: true,
      deletedCount: successfulDeletes,
      message: `Berhasil menghapus ${successfulDeletes} pengumuman kedaluwarsa`,
    };
  } catch (error) {
    console.error("Unexpected error in deleteExpiredAnnouncements:", error);
    return {
      success: false,
      error: "Terjadi kesalahan sistem",
      deletedCount: 0,
    };
  }
}

export async function bulkDeleteAnnouncements(ids: string[]) {
  try {
    const supabase = await createServer();

    console.log("🗑️ Bulk deleting announcements:", ids);

    const { error } = await supabase
      .from("announcements")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Bulk delete error:", error);
      return { success: false, error: "Gagal menghapus pengumuman" };
    }

    console.log(`✅ Successfully deleted ${ids.length} announcements`);

    revalidatePath("/admin/announcements");
    revalidatePath("/");

    return { success: true, deletedCount: ids.length };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan sistem" };
  }
}
