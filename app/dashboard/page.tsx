"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";

import data from "./data.json";
import { useBlogs } from "@/hooks/use-blogs";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const { getBlogs, deleteBlog } = useBlogs();
  const [blogs, setBlogs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (error: any) {
      alert(error.message || "Gagal mengambil data blog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // 🔎 cek role user dari tabel profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile || profile.role !== "admin") {
        router.replace("/");
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    };
    check();
    fetchBlogs();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // tidak render apapun kalau bukan admin
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />

            <DataTable data={blogs} />
          </div>
        </div>
      </div>
    </>
  );
}
