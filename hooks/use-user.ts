"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type UserProfile = {
  id: string;
  email: string;
  role?: string;
  username?: string;
};

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil user dari auth
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          setUser(null);
          return;
        }

        // Ambil profile dari tabel profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: user.id,
          email: user.email ?? "",
          username: profile?.username,
          role: profile?.role,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal mengambil user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 🔄 Listener kalau ada perubahan auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading, error };
}
