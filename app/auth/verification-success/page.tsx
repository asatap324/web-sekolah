import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-foreground">
            <svg
              className="h-6 w-6 text-white dark:text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">Email Terverifikasi!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Akun Anda telah berhasil diverifikasi. Sekarang Anda bisa login ke
            akun Anda.
          </p>
          <div className="mt-6">
            <Button asChild size="sm" className="w-full px-4 py-2 text-sm">
              <Link href="/auth/login">Login Sekarang</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
