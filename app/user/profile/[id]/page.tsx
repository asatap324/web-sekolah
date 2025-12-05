// app/users/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfile } from "@/components/profiles";
import { getServerUser } from "@/utils/auth-server";
import { createServer } from "@/utils/supabase/server";
import { createServerClientSimple } from "@/utils/supabase/static-props";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

interface User {
  id: string;
  username: string | null;
  email: string;
  role: string | null;
  created_at: string;
  email_verified: boolean;
  verified_at: string | null;
}

async function getUserById(id: string): Promise<User | null> {
  const supabase = await createServer();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, username, role, created_at, email_user, email_verified, verified_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) {
    console.error("Error fetching user:", error);
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email_user,
    role: profile.role,
    created_at: profile.created_at,
    email_verified: profile.email_verified,
    verified_at: profile.verified_at,
  };
}

// ✅ Pre-generate user IDs (jika perlu, optional)
export async function generateStaticParams() {
  // Jika ingin SSG untuk user profiles tertentu
  const supabase = createServerClientSimple();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(50); // Batasi jumlah yang di-generate

  if (error || !data) return [];

  return data.map((user) => ({
    id: user.id,
  }));
}

// ✅ Generate metadata seperti blog page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return {
        title: "User Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const displayName = user.username || user.email.split("@")[0];

    return {
      title: `${displayName}`,
      description: `View ${displayName}'s profile`,
      openGraph: {
        title: `${displayName}`,
        description: `View ${displayName}'s profile`,
        type: "profile",
      },
    };
  } catch (error) {
    return {
      title: "User Profile",
    };
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  // console.log("🔄 Fetching user with ID:", id);

  // ✅ Simple validation seperti blog page
  if (!id) {
    notFound();
  }

  try {
    // ✅ Fetch data langsung seperti blog page
    const [user, currentUser] = await Promise.all([
      getUserById(id),
      getServerUser(),
    ]);

    if (!user) {
      console.error("❌ User not found for ID:", id);
      notFound();
    }

    // console.log("✅ User found:", user.id);

    const isOwnProfile = currentUser?.id === id;

    return (
      <UserProfile
        user={user}
        isOwnProfile={isOwnProfile}
        currentUser={currentUser}
      />
    );
  } catch (error) {
    console.error("❌ Error in user profile page:", error);
    notFound();
  }
}
