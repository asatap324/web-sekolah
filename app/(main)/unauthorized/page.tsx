import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Akses Ditolak
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <div className="mt-6 space-y-4">
            <Button
              className="w-full py-2 px-4 rounded-md"
              render={<Link href="/" />}
            >
              Kembali ke Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
