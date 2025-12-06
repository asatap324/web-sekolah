"use server";

import { createServer } from "@/utils/supabase/server";
import { headers } from "next/headers";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  message?: string;
};

export async function checkRateLimit(email: string): Promise<RateLimitResult> {
  try {
    const supabase = await createServer();

    // EMAIL-ONLY: Cari attempt berdasarkan email
    const { data: attempt, error } = await supabase
      .from("login_attempts")
      .select("*")
      .eq("email", email)
      .order("last_attempt", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { allowed: true, remaining: 5 };
    }

    if (!attempt) {
      return { allowed: true, remaining: 5 };
    }

    // Gunakan is_locked & locked_until dari schema existing
    if (attempt.is_locked && attempt.locked_until) {
      const lockUntil = new Date(attempt.locked_until);
      const now = new Date();

      if (now < lockUntil) {
        const minutesLeft = Math.ceil(
          (lockUntil.getTime() - now.getTime()) / (1000 * 60),
        );
        return {
          allowed: false,
          message: `Terlalu banyak percobaan login. Coba lagi dalam ${minutesLeft} menit.`,
          remaining: 0,
        };
      } else {
        // Reset lock jika waktu sudah habis
        await supabase
          .from("login_attempts")
          .update({
            is_locked: false,
            locked_until: null,
            attempts: 1,
          })
          .eq("id", attempt.id);
        return { allowed: true, remaining: 4 };
      }
    }

    // Check attempts count dan auto-lock jika >= 5
    if (attempt.attempts >= 5) {
      const lockedUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

      await supabase
        .from("login_attempts")
        .update({
          is_locked: true,
          locked_until: lockedUntil.toISOString(),
        })
        .eq("id", attempt.id);

      return {
        allowed: false,
        message: "Terlalu banyak percobaan login. Coba lagi dalam 1 jam.",
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining: 5 - attempt.attempts,
    };
  } catch (error) {
    return { allowed: true, remaining: 5 };
  }
}

export async function recordLoginAttempt(email: string, success: boolean) {
  try {
    const supabase = await createServer();
    const headersList = await headers();

    // Masih ambil IP untuk analytics, tapi tidak untuk logic
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    if (success) {
      // Hapus record ketika login sukses
      await supabase.from("login_attempts").delete().eq("email", email);
    } else {
      const { data: attempt } = await supabase
        .from("login_attempts")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      const now = new Date().toISOString();

      if (attempt) {
        // Update existing attempt
        await supabase
          .from("login_attempts")
          .update({
            attempts: attempt.attempts + 1,
            last_attempt: now,
            ip_address: ipAddress, // Update IP untuk analytics
            is_locked: false, // Reset lock status pada new attempt
          })
          .eq("id", attempt.id);
      } else {
        // Create new attempt
        await supabase.from("login_attempts").insert({
          ip_address: ipAddress,
          email: email,
          attempts: 1,
          last_attempt: now,
          is_locked: false,
          locked_until: null,
        });
      }
    }
  } catch (error) {
    console.error("Non-critical operation failed");
  }
}
