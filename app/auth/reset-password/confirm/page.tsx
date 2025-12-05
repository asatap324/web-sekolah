import { UpdatePasswordForm } from "@/components/auth";

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
      <div className="max-w-sm w-full">
        <div>
          <h1 className="mt-3 text-center text-3xl font-semibold text-foreground tracking-tight">
            Change password
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </div>

        <UpdatePasswordForm token={token} />
      </div>
    </div>
  );
}
