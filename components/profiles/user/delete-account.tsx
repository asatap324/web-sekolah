"use client";
import { AlertTriangleIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { hardDeleteAccount } from "@/app/actions/auth/user-action";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteAccount() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = async () => {
    // // 1. Validasi konfirmasi text
    // if (confirmationText !== "HAPUS AKUN") {
    //   toast.error("Konfirmasi salah", {
    //     description: 'Ketik "HAPUS AKUN" untuk menghapus',
    //   });
    //   return;
    // }

    // // 2. Double confirmation
    // if (!window.confirm("YAKIN HAPUS AKUN PERMANEN?\n\n• Semua data akan hilang\n• Tidak dapat dikembalikan\n• Anda akan logout otomatis")) {
    //   return;
    // }

    setIsLoading(true);

    const result = await hardDeleteAccount();

    if (!result?.success) {
      toast.error("Gagal menghapus akun", {
        description: result?.error || "Terjadi kesalahan",
      });
      setIsLoading(false);
      return;
    }

    // Success - tampilkan toast
    toast.success("Akun berhasil dihapus", {
      description: "Mengarahkan ke beranda...",
    });

    // CLEAR LOCAL STORAGE & SESSION STORAGE
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies yang terkait auth
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.split("=")[0].trim();
        if (cookieName.includes("sb-") || cookieName.includes("supabase")) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }

    // FORCE HARD REDIRECT (jangan pakai router.push!)
    // Tunggu 1.5 detik untuk toast terlihat, lalu redirect
    setTimeout(() => {
      // Method 1: window.location.replace (rekomendasi)
      window.location.replace("/");

      // Method 2: window.location.href dengan timestamp untuk bypass cache
      // const timestamp = Date.now();
      // window.location.href = `/?deleted=true&ts=${timestamp}`;

      // Method 3: Jika ingin ada feedback di homepage
      // window.location.href = "/?account_deleted=true";
    }, 1500);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 rounded-lg border border-destructive/50 p-4 justify-between">
        <div className="flex items-start md:items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <AlertTriangleIcon className="size-4 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="mb-0 text-destructive">Hapus Akun</h3>
            <p className="text-sm text-muted-foreground">
              Hapus akun Anda secara permanen beserta semua data yang terkait.
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="destructive-outline"
                className="w-auto text-destructive"
              />
            }
          >
            Hapus Akun
          </DialogTrigger>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan. Hal ini akan menghapus akun
                Anda secara permanen dan menghapus data Anda dari server kami.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel className="px-0">
              <Label>
                Ketik
                <span className="font-medium text-red-600">HAPUS AKUN</span>
                untuk konfirmasi
              </Label>
              <Input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="HAPUS AKUN"
                className="mt-2"
                disabled={isLoading}
              />
            </DialogPanel>
            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" disabled={isLoading} />}
              >
                Batal
              </DialogClose>
              <DialogClose
                render={
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading || confirmationText !== "HAPUS AKUN"}
                  />
                }
              >
                Hapus Akun
              </DialogClose>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      </div>
    </div>
  );
}
