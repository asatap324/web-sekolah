import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full space-y-8 p-8">
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
          <h1 className="mt-3 text-3xl font-semibold">Email Terverifikasi!</h1>
          <p className="text-sm text-muted-foreground text-pretty mt-1">
            Akun Anda telah berhasil diverifikasi. Sekarang Anda bisa login ke
            akun Anda.
          </p>
          <div className="mt-6">
            <Button className="w-full " render={<Link href="/auth/login" />}>
              Login Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
