"use client";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { useActionState, useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "@/types/form-schema";
import { EyeIcon, EyeOffIcon, Lock, Mail, User } from "lucide-react";
import { signupAction } from "@/app/actions";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";

type FormValues = z.infer<typeof registerSchema>;

const initialState = {
  error: null as string | null,
  success: false,
  redirectTo: undefined as string | undefined,
};

export function RegisterForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible((prevState) => !prevState);
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  useEffect(() => {
    if (state.error) {
      toast.error("An error occurred!", {
        description: state.error,
      });
    }

    if (state.success) {
      toast.success(<p className="text-sm">{state.message}</p>);
    }
  }, [state.error, state.success, state.message]);

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col gap-6" action={formAction}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Daftarkan akun Anda</h1>
            <p className="text-foreground text-sm">
              Masukkan alamat email Anda di bawah ini untuk mendaftar ke akun
              Anda.
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>
                    Username{" "}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <User className="size-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        {...field}
                        placeholder="John Doe"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>
                    Email{" "}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Mail className="size-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="email"
                        {...field}
                        placeholder="nama@example.com"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>
                    Password{" "}
                    <span aria-label="required" className="text-destructive">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Lock className="size-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type={isVisible ? "text" : "password"}
                        {...field}
                        placeholder="Buat password"
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={toggleVisible}
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="grid gap-6 mt-5">
        <div className="text-center text-sm">
          Sudah memiliki akun ?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
