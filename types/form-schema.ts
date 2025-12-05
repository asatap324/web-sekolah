import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password Minimal 6 Karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password Tidak Cocok",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email Tidak Boleh Kosong" })
    .email({ message: "Email is Required" }),
  password: z.string().min(6, "Password Minimal 6 Karakter"),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password minimal 6 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
});

export const requestResetPasswordSchema = z.object({
  email: z.string().email(),
});
