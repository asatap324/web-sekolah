// app/api/auth/user/route.ts
import { getServerUser } from "@/utils/auth-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();

    const response = NextResponse.json(user);

    // ✅ SET CACHE HEADERS - 5 menit
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600",
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
