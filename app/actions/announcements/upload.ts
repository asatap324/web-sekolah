"use server";

import { createServer } from "@/utils/supabase/server";

export async function uploadImage(
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createServer();

    // Validasi file
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "File harus berupa gambar" };
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return { url: null, error: "Ukuran file maksimal 5MB" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `announcements/${fileName}`;

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { url: null, error: "Gagal mengupload gambar" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return { url: null, error: "Terjadi kesalahan sistem" };
  }
}

export async function deleteImage(
  imageUrl: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServer();

    // Extract filename dari URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `announcements/${fileName}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: "Gagal menghapus gambar" };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return { success: false, error: "Terjadi kesalahan sistem" };
  }
}
