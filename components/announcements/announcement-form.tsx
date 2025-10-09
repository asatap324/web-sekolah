"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadImage } from "@/app/actions/announcements/upload";
import { createAnnouncement } from "@/app/actions/announcements/announcement-admin";
import Image from "next/image";
import { AnnouncementFormData } from "./types";
import { toast } from "sonner";

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnnouncementCreated: (announcement: any) => void;
  children: React.ReactNode;
}

const formatDateForInput = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export function AnnouncementForm({
  open,
  onOpenChange,
  onAnnouncementCreated,
  children,
}: AnnouncementFormProps) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    content: "",
    content_type: "text",
    active: true,
    type: "info",
    priority: 1,
    start_date: formatDateForInput(new Date()), // ✅ Default: hari ini
    end_date: formatDateForInput(getTomorrowDate()), // ✅ Default: besok
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDateChange = (
    field: "start_date" | "end_date",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.warning("Judul tidak boleh kosong");
        setSubmitLoading(false);
        return;
      }

      if (formData.content_type === "text" && !formData.content.trim()) {
        toast.warning("Konten tidak boleh kosong untuk jenis teks");
        setSubmitLoading(false);
        return;
      }

      if (formData.content_type === "image" && !selectedFile) {
        toast.warning("Gambar harus dipilih untuk jenis gambar");
        setSubmitLoading(false);
        return;
      }

      // ✅ Validasi tanggal
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate <= startDate) {
        toast.warning("Tanggal berakhir harus setelah tanggal mulai");
        setSubmitLoading(false);
        return;
      }

      let imageUrl = "";

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile);

        if (!uploadResult.url) {
          alert(uploadResult.error || "Gagal mengupload gambar");
          setSubmitLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      const finalFormData = {
        ...formData,
        image_url: imageUrl,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      const result = await createAnnouncement(finalFormData);

      if (result.success) {
        onAnnouncementCreated(result.data);
        resetForm();
        onOpenChange(false);
        toast.success("Pengumuman berhasil dibuat!");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      content_type: "text",
      active: true,
      type: "info",
      priority: 1,
      start_date: formatDateForInput(new Date()),
      end_date: formatDateForInput(getTomorrowDate()),
    });
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {children}
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle>Buat Pengumuman</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk membuat pengumuman baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Judul pengumuman"
              required
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Tanggal Mulai *
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleDateChange("start_date", e.target.value)}
                required
                min={formatDateForInput(new Date())} // Tidak boleh memilih tanggal kemarin
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Kapan pengumuman mulai ditampilkan
              </p>
            </div>

            <div>
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Tanggal Berakhir *
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleDateChange("end_date", e.target.value)}
                required
                min={formData.start_date} // Tidak boleh sebelum start_date
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Kapan pengumuman berakhir
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="content_type">Jenis Konten</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  content_type: value,
                }))
              }
            >
              <SelectTrigger className="mt-1.5" id="content_type">
                <SelectValue placeholder="Pilih jenis konten" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="text">Teks Saja</SelectItem>
                  <SelectItem value="image">Gambar</SelectItem>
                  <SelectItem value="mixed">Teks dan Gambar</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(formData.content_type === "image" ||
            formData.content_type === "mixed") && (
            <div>
              <Label htmlFor="image">
                Upload Gambar{" "}
                {formData.content_type === "mixed" ? "(Opsional)" : "*"}
              </Label>

              {imagePreview ? (
                <div className="border border-dashed border-border rounded-lg p-4 mt-1.5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-600 font-medium">
                        Gambar siap diupload
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedFile?.name} •{" "}
                        {(selectedFile?.size || 0) / 1024 / 1024} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-lg p-6 text-center mt-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk memilih gambar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (max. 5MB)
                    </p>
                  </label>
                </div>
              )}
            </div>
          )}

          {(formData.content_type === "text" ||
            formData.content_type === "mixed") && (
            <div>
              <Label htmlFor="content">
                Konten {formData.content_type === "mixed" ? "(Opsional)" : "*"}
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Isi pengumuman..."
                rows={4}
                required={formData.content_type === "text"}
                className="mt-1.5"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="mt-1.5" id="type">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                value={String(formData.priority)}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="mt-1.5" id="priority">
                  <SelectValue placeholder="Pilih Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Rendah</SelectItem>
                    <SelectItem value="2">Sedang</SelectItem>
                    <SelectItem value="3">Tinggi</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  active: checked === true,
                }))
              }
            />
            <Label htmlFor="active">Aktif segera setelah dibuat</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengumuman"
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
