import { UpdatePasswordForm } from "@/components/auth-ui/update-password";

interface PageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordConfirmPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Buat Password Baru
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Masukkan password baru Anda
          </p>
        </div>

        <UpdatePasswordForm token={token} />
      </div>
    </div>
  );
}
