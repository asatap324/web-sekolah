"use client";
import z from "zod";
import { useActionState, useEffect, useState } from "react";
import { requestResetPasswordAction } from "@/app/actions/auth/reset-password";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@/components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldValidity,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail } from "lucide-react";
import { requestResetPasswordSchema } from "@/types/form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

type FormValues = z.infer<typeof requestResetPasswordSchema>;

export function RequestResetForm() {
  const [state, formAction, isPending] = useActionState(
    requestResetPasswordAction,
    {
      error: null,
      success: false,
      message: "",
    },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(requestResetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const {
    register,
    formState: { errors, isValid, isDirty },
  } = form;

  useEffect(() => {
    if (state.error) {
      toast.error("Gagal mengirim link reset password", {
        description: state.error || "Terjadi kesalahan, silakan coba lagi",
        duration: 5000,
        position: "top-right",
      });
    }

    if (state.success) {
      toast.success("Link reset password terkirim!", {
        description:
          state.message || "Cek inbox email Anda untuk link reset password",
        duration: 5000,
        position: "top-right",
      });
    }
  }, [state.error, state.success, state.message]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <Field>
          <FieldLabel htmlFor="email">
            Email <span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              size="lg"
              disabled={isPending}
              {...register("email")}
            />
          </InputGroup>

          <FieldDescription>
            We'll send a password reset link to this email address
          </FieldDescription>

          <FieldError>
            {errors.email?.message || "Please enter a valid email."}
          </FieldError>
        </Field>

        <div className="space-y-3.5">
          <Button
            className="w-full"
            type="submit"
            disabled={isPending || !isValid || !isDirty}
          >
            {isPending ? "Mengirim..." : "Kirim Reset Link"}
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
      </form>
    </Form>
  );
}
