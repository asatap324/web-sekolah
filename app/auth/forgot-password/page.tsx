import { RequestResetForm } from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xs w-full">
        <div className="mb-5">
          <h1 className="mt-3 text-center text-3xl font-semibold text-foreground">
            Reset Password
          </h1>
          <p className="text-center text-sm text-muted-foreground text-pretty">
            Masukkan email Anda dan kami akan mengirim link reset password
          </p>
        </div>

        <RequestResetForm />
      </div>
    </div>
  );
}
