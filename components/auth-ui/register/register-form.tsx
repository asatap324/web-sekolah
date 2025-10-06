"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signupAction } from "@/app/actions";
import { toast } from "sonner";

type FormValues = z.infer<typeof registerSchema>;

const initialState = {
  error: null as string | null,
  success: false,
  redirectTo: undefined as string | undefined,
};

export default function RegisterForm() {
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
      toast.error(<p className="text-sm">An error occurred!</p>);
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
            <h1 className="text-2xl font-bold">Signup your account</h1>
            <p className="text-foreground text-sm text-balance">
              Enter your email below to signup to your account
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        {...field}
                      />
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signup in..." : "Sign up"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="grid gap-6 mt-5">
        <div className="text-center text-sm">
          Already have an account ?{" "}
          <a href="/auth/login" className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </div>
    </>
  );
}
