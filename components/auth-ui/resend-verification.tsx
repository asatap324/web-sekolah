"use client";

import { useState, useEffect } from "react";
import { resendVerificationAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Mail, TriangleAlert } from "lucide-react";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi email dasar
    if (!email || !email.includes("@")) {
      toast.error("Masukkan email yang valid", {
        description: "Format email harus benar (contoh: user@example.com)",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    setHasSubmitted(true);

    try {
      const result = await resendVerificationAction(email);

      if (result.success) {
        toast.success("Email verifikasi terkirim! 🎉", {
          description:
            result.message || "Cek inbox email Anda untuk link verifikasi",
          duration: 5000,
          position: "top-center",
        });

        // Reset form setelah sukses
        setEmail("");
        setHasSubmitted(false);
      } else {
        toast.error("Gagal mengirim email", {
          description: result.error || "Terjadi kesalahan, silakan coba lagi",
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", {
        description: "Silakan refresh halaman dan coba lagi",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus input ketika component mount
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-3.5">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Mail size={16} className="text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">
            Kirim Ulang Verifikasi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan email Anda untuk mengirim ulang link verifikasi
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Alamat Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full mt-2 focus:ring-1 focus:outline-none"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Pastikan email yang dimasukkan sama dengan saat pendaftaran
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2
                  size={16}
                  aria-hidden="true"
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                />
                <span>Mengirim...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <TriangleAlert className="me-3" size={16} aria-hidden="true" />
                <span>Kirim Link Verifikasi</span>
              </div>
            )}
          </Button>

          <div className="text-center">
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/auth/login">Kembali ke halaman login</Link>
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Tidak menerima email?
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Cek folder spam atau junk mail</li>
            <li>• Pastikan email yang dimasukkan benar</li>
            <li>• Tunggu beberapa menit sebelum request ulang</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
