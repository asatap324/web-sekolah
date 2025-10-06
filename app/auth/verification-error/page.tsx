import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Verifikasi Gagal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Link verifikasi tidak valid atau sudah kedaluwarsa.
          </p>
          <div className="mt-6 space-y-4">
            <Button asChild className="w-full rounded-md px-4 py-2 text-sm">
              <Link href="/auth/resend-verification">
                Kirim Ulang Link Verifikasi
              </Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-md px-4 py-2 text-sm"
              variant="secondary"
            >
              <Link href="/auth/login">Kembali ke Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
