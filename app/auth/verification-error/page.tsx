import { ArrowLeftIcon } from "@/components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-foreground">
            <svg
              className="h-6 w-6 text-background"
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
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            Verifikasi Gagal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Link verifikasi tidak valid atau sudah kedaluwarsa. Silakan request
            link verifikasi lagi.
          </p>
          <div className="mt-6 space-y-4">
            <Button
              className="w-full"
              render={<Link href="/auth/resend-verification" />}
            >
              Kirim Ulang Link Verifikasi
            </Button>
            <Button
              className="w-full "
              variant="link"
              render={<Link href="/auth/login" />}
            >
              <AnimateIcon animateOnHover className="flex items-center">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                <span>Kembali ke Login</span>
              </AnimateIcon>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
