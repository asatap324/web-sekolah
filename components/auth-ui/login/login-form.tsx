"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useActionState,
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
import { loginSchema } from "@/types/form-schema";
import Link from "next/link";
import { loginAction } from "@/app/actions";
import { useRouter } from "next/navigation";

// Type untuk optimistic state
type OptimisticState = {
  isLoggingIn: boolean;
  remainingAttempts: number;
  error: string | null;
};

type FormValues = z.infer<typeof loginSchema>;

// const initialState = {
//   error: null,
//   success: false,
//   redirectTo: undefined,
//   remainingAttempts: 5,
// };

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Optimistic state
  const [optimisticState, setOptimisticState] = useOptimistic<OptimisticState>({
    isLoggingIn: false,
    remainingAttempts: 5,
    error: null,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleVisible = () => setIsVisible((prev) => !prev);

  // ✅ Form submission dengan optimistic updates
  const handleSubmit = async (formData: FormData) => {
    // ✅ Immediate optimistic update
    setOptimisticState({
      isLoggingIn: true,
      remainingAttempts: optimisticState.remainingAttempts,
      error: null,
    });

    startTransition(async () => {
      try {
        const result = await loginAction(optimisticState, formData);

        // Handle result berdasarkan state dari server action
        if (result.error) {
          // Update optimistic state dengan result dari server
          setOptimisticState({
            isLoggingIn: false,
            remainingAttempts:
              result.remainingAttempts || optimisticState.remainingAttempts,
            error: result.error,
          });

          // Show appropriate toast
          if (result.remainingAttempts === 0) {
            toast.error(
              result.error || "Akun terkunci! Coba lagi dalam 1 jam.",
            );
          } else if (result.remainingAttempts === 1) {
            toast.warning(
              result.error ||
                "Percobaan terakhir! Jika gagal, akun akan dikunci sementara.",
            );
          } else if (result.remainingAttempts && result.remainingAttempts < 5) {
            toast.warning(
              result.error ||
                `Login gagal! ${result.remainingAttempts} percobaan tersisa.`,
            );
          } else {
            toast.error(result.error);
          }
        } else if (result.success) {
          // ✅ Success - show success message
          toast.success("Login berhasil! Mengarahkan...");

          // Redirect setelah delay kecil
          setTimeout(() => {
            if (result.redirectTo) {
              window.location.href = result.redirectTo;
            } else {
              window.location.href = "/";
            }
          }, 500);
        }
      } catch (error) {
        // Fallback error handling
        setOptimisticState({
          isLoggingIn: false,
          remainingAttempts: optimisticState.remainingAttempts,
          error: "Terjadi kesalahan sistem",
        });
        toast.error("Terjadi kesalahan sistem");
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col gap-6" action={handleSubmit}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      disabled={optimisticState.isLoggingIn}
                    />
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
                    <div className="flex justify-between items-center">
                      <span>Password</span>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="link"
                        type="button"
                        disabled={optimisticState.isLoggingIn}
                      >
                        <Link href="/auth/forgot-password">
                          Forgot your password?
                        </Link>
                      </Button>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        {...field}
                        disabled={optimisticState.isLoggingIn}
                      />
                      <button
                        className="text-muted-foreground/80 cursor-pointer hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisible}
                        disabled={optimisticState.isLoggingIn}
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

            {/* ✅ Optimistic Loading State */}
            <Button
              type="submit"
              className="w-full"
              disabled={optimisticState.isLoggingIn}
            >
              {optimisticState.isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="grid gap-6 mt-5">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
}
