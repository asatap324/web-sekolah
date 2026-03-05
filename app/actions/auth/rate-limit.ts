"use server";

import { createServer } from "@/utils/supabase/server";
import { headers } from "next/headers";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  message?: string;
};

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 jam
const IP_MAX_ATTEMPTS = 20; // Batas per IP (semua email)

export async function checkRateLimit(email: string): Promise<RateLimitResult> {
  try {
    const supabase = await createServer();
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // ✅ FIX 1: Cek rate limit per IP juga (cegah ganti-ganti email)
    if (ipAddress !== "unknown") {
      const oneHourAgo = new Date(Date.now() - LOCK_DURATION_MS).toISOString();
      const { count } = await supabase
        .from("login_attempts")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ipAddress)
        .gte("last_attempt", oneHourAgo);

      if ((count ?? 0) >= IP_MAX_ATTEMPTS) {
        return {
          allowed: false,
          remaining: 0,
          message:
            "Terlalu banyak percobaan dari perangkat ini. Coba lagi dalam 1 jam.",
        };
      }
    }

    // Cek rate limit per email
    const { data: attempt, error } = await supabase
      .from("login_attempts")
      .select("*")
      .eq("email", email)
      .order("last_attempt", { ascending: false })
      .limit(1)
      .maybeSingle();

    // ✅ FIX 2: Jangan izinkan akses saat error DB
    if (error) {
      console.error("Rate limit DB error:", error);
      return {
        allowed: false,
        remaining: 0,
        message: "Terjadi kesalahan sistem. Coba lagi nanti.",
      };
    }

    if (!attempt) {
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    // Cek apakah masih terkunci
    if (attempt.is_locked && attempt.locked_until) {
      const lockUntil = new Date(attempt.locked_until);
      const now = new Date();

      if (now < lockUntil) {
        const minutesLeft = Math.ceil(
          (lockUntil.getTime() - now.getTime()) / (1000 * 60),
        );
        return {
          allowed: false,
          remaining: 0,
          message: `Terlalu banyak percobaan login. Coba lagi dalam ${minutesLeft} menit.`,
        };
      } else {
        // Reset lock jika waktu sudah habis
        await supabase
          .from("login_attempts")
          .update({ is_locked: false, locked_until: null, attempts: 1 })
          .eq("id", attempt.id);
        return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
      }
    }

    if (attempt.attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
      await supabase
        .from("login_attempts")
        .update({ is_locked: true, locked_until: lockedUntil.toISOString() })
        .eq("id", attempt.id);

      return {
        allowed: false,
        remaining: 0,
        message: "Terlalu banyak percobaan login. Coba lagi dalam 1 jam.",
      };
    }

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - attempt.attempts,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // ✅ FIX 2: Error = tolak akses, bukan izinkan
    return {
      allowed: false,
      remaining: 0,
      message: "Terjadi kesalahan sistem. Coba lagi nanti.",
    };
  }
}

export async function recordLoginAttempt(email: string, success: boolean) {
  try {
    const supabase = await createServer();
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    if (success) {
      await supabase.from("login_attempts").delete().eq("email", email);
      return;
    }

    const { data: attempt } = await supabase
      .from("login_attempts")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    const now = new Date().toISOString();
    const newAttemptCount = (attempt?.attempts ?? 0) + 1;

    // ✅ FIX 3: Jangan reset is_locked saat update
    const shouldLock = newAttemptCount >= MAX_ATTEMPTS;
    const lockedUntil = shouldLock
      ? new Date(Date.now() + LOCK_DURATION_MS).toISOString()
      : null;

    if (attempt) {
      await supabase
        .from("login_attempts")
        .update({
          attempts: newAttemptCount,
          last_attempt: now,
          ip_address: ipAddress,
          // ✅ Tidak reset is_locked jika sudah terkunci
          ...(shouldLock && { is_locked: true, locked_until: lockedUntil }),
        })
        .eq("id", attempt.id);
    } else {
      await supabase.from("login_attempts").insert({
        ip_address: ipAddress,
        email: email,
        attempts: 1,
        last_attempt: now,
        is_locked: false,
        locked_until: null,
      });
    }
  } catch (error) {
    console.error("Record login attempt failed:", error);
  }
}
