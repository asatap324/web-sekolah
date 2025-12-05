"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePasswordAction } from "@/app/actions/auth/reset-password";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon, Lock, Shield } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

interface UpdatePasswordFormProps {
  token?: string;
}

export function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, {
    error: null,
    success: false,
    message: "",
  });

  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const supabase = createClient();

  const toggleVisible = () => setIsVisible((prev) => !prev);
  const toggleConfirmVisible = () => setIsConfirmVisible((prev) => !prev);

  // Cek apakah ada valid reset session
  useEffect(() => {
    const checkResetSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Jika tidak ada user, berarti tidak ada valid reset session
        if (!user) {
          router.push("/auth/forgot-password?error=invalid_or_expired_link");
          return;
        }

        setIsCheckingSession(false);
      } catch (error) {
        router.push("/auth/forgot-password?error=session_error");
      }
    };

    checkResetSession();
  }, [router, supabase]);

  // Redirect setelah sukses
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        // Logout user dari reset session dan redirect ke login
        supabase.auth.signOut().then(() => {
          router.push("/auth/login?message=password_reset_success");
        });
      }, 2000);
    }
  }, [state.success, router, supabase]);

  useEffect(() => {
    if (!state) return;

    if (state.error) {
      toast.error("Gagal membuat password baru", {
        description: state.error || "Terjadi kesalahan, silakan coba lagi",
        duration: 5000,
        position: "top-right",
      });
    }

    if (state.success) {
      toast.success(state.message, {
        description: "Lakukan login dengan password baru Anda",
        duration: 5000,
        position: "top-right",
      });
    }
  }, [state.error, state.message]);

  // if (isCheckingSession) {
  //   toast("Memverifikasi session reset password...", {
  //     position: "bottom-right",
  //   });
  // }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="token" value={token || ""} />
      <div className="space-y-4 ">
        <Field>
          <FieldLabel htmlFor="password">
            Password Baru{" "}
            <span aria-label="required" className="text-destructive">
              *
            </span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Shield className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Enter new password"
            />
            <InputGroupAddon align="inline-end">
              <button
                className="text-muted-foreground/80 cursor-pointer hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisible}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>

          <FieldDescription>Must be at least 8 characters</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Konfirmasi Password{" "}
            <span aria-label="required" className="text-destructive">
              *
            </span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Lock className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              type={isConfirmVisible ? "text" : "password"}
              required
              placeholder="Confirm new password"
            />
            <InputGroupAddon align="inline-end">
              <button
                className="text-muted-foreground/80 cursor-pointer hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleConfirmVisible}
                aria-label={
                  isConfirmVisible ? "Hide password" : "Show password"
                }
                aria-pressed={isConfirmVisible}
                aria-controls="password"
              >
                {isConfirmVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>

      <div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Mengupdate..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
