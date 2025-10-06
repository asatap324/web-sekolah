import { RequestResetForm } from "@/components/auth-ui/reset-password/request-reset-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Masukkan email Anda dan kami akan mengirim link reset password
          </p>
        </div>

        <RequestResetForm />
      </div>
    </div>
  );
}
