"use client";

import { useActionState, useEffect } from "react";
import { requestResetPasswordAction } from "@/app/actions/auth/reset-password";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export function RequestResetForm() {
  const [state, formAction, isPending] = useActionState(
    requestResetPasswordAction,
    {
      error: null,
      success: false,
      message: "",
    },
  );

  useEffect(() => {
    if (state.error) {
      toast.error(<p className="text-sm">{state.error}</p>);
    }

    if (state.success) {
      toast.success(<p className="text-sm">{state.message}</p>);
    }
  }, [state.error, state.success, state.message]);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <Label htmlFor="email" className="sr-only">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
        />
      </div>

      <div className="space-y-3.5">
        <Button
          className="px-4 py-2 rounded-md w-full"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Mengirim..." : "Kirim Reset Link"}
        </Button>
        <Button
          variant="secondary"
          asChild
          className="py-2 px-4 rounded-md w-full"
        >
          <Link href="/auth/login" className="font-medium">
            Kembali ke Login
          </Link>
        </Button>
      </div>
    </form>
  );
}
