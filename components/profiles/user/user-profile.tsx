// app/users/[id]/user-profile-client.tsx
"use client";

import { FlickeringGrid, StyledCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useUser } from "@/hooks/use-user";
import {
  AlertTriangleIcon,
  CheckIcon,
  IdCardLanyardIcon,
  MailIcon,
  PenIcon,
  SaveIcon,
  UserCircle2,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteAccount } from "./delete-account";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateUserProfile } from "@/app/actions/auth/user-action";
import { toast } from "sonner";

interface UserProfileClientProps {
  user: {
    id: string;
    username: string | null;
    role: string | null;
    created_at: string;
    email?: string;
    email_verified?: boolean;
  };
  isOwnProfile: boolean;
  currentUser: any;
}

export function UserProfile({
  user,
  isOwnProfile,
  currentUser,
}: UserProfileClientProps) {
  const { user: currentUserClient } = useUser();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || "",
  });
  const [originalData, setOriginalData] = useState(formData);

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      username: user.username || "",
    });
    setOriginalData({
      username: user.username || "",
    });
  }, [user]);

  const hasChanges = formData.username !== originalData.username;

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);

    const result = await updateUserProfile(formDataToSend);

    if (result?.error) {
      toast.error("Error", {
        description: result.error,
      });

      // Reset to original data on error
      setFormData(originalData);
    } else {
      toast.success("Success", {
        description: result.success || "Profile updated successfully",
      });

      // Update original data
      setOriginalData(formData);
      setIsEditing(false);
      router.refresh();
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="h-full bg-sidebar relative mt-16 sm:mt-28">
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] mask-[linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>
      <div className="p-6 border-b border-border flex flex-col gap-6 min-h-[150px] justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          {/*<h1 className="font-medium text-4xl md:text-5xl tracking-tighter max-w-4xl mb-2">
            Daftar Guru dan Staff
          </h1>*/}
        </div>
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="tab-1"
        className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10 w-full"
      >
        <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
        <aside className="hidden lg:block w-[350px] shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
          <StyledCard>
            <div className="p-6">
              <h2 className="font-semibold">Pengaturan Akun</h2>
              <div className="border-s mt-4">
                <TabsList variant="underline">
                  <TabsTab value="tab-1">My Profile</TabsTab>
                </TabsList>
              </div>
            </div>
          </StyledCard>
        </aside>
        <div className="w-full p-6 lg:p-10 overflow-hidden">
          <TabsPanel value="tab-1">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Pengaturan Akun</h2>
                <p className="text-muted-foreground text-sm">
                  Kelola informasi profil Anda
                </p>
              </div>
              {isOwnProfile && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex gap-4">
                    {hasChanges && isEditing && (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <XIcon className="size-4" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          <SaveIcon className="size-4" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    <PenIcon className="size-4" />
                    {isEditing ? "Stop Editing" : "Edit Profile"}
                  </Button>
                </div>
              )}
            </div>
            <div className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 border-b pb-4 mb-4">
                <Field>
                  <FieldLabel htmlFor="ID">ID</FieldLabel>
                  <Badge size="lg" variant="outline" id="ID" className="mt-2">
                    {user.id}
                  </Badge>
                </Field>
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Badge
                    variant="outline"
                    className="capitalize mt-2"
                    id="role"
                    size="lg"
                  >
                    {user.role}
                  </Badge>
                </Field>
                <Field>
                  <FieldLabel htmlFor="member">Bergabung sejak</FieldLabel>
                  <Badge
                    size="lg"
                    variant="outline"
                    id="member"
                    className="mt-2"
                  >
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Badge>
                </Field>
                <Field>
                  <FieldLabel>Email Verifikasi</FieldLabel>{" "}
                  {user.email_verified ? (
                    <Badge size="lg" variant="success" className="mt-2">
                      <CheckIcon className="size-4" />
                      Terverifikasi
                    </Badge>
                  ) : (
                    <Button
                      variant="link"
                      className="-ml-3"
                      render={<Link href="/auth/resend-verification" />}
                    >
                      Kirim Ulang Email Verifikasi
                    </Button>
                  )}
                </Field>
              </div>
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputGroup className="mt-2">
                    <InputGroupAddon align="inline-start">
                      <UserCircle2 className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      readOnly={!isEditing}
                    />
                  </InputGroup>
                  {isEditing && (
                    <FieldDescription>
                      Username harus unik dan tidak mengandung spasi
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">
                    Email{" "}
                    {!user.email_verified && (
                      <Badge variant="destructive" size="lg">
                        <AlertTriangleIcon className="size-4" />
                        Belum Verifikasi
                      </Badge>
                    )}
                  </FieldLabel>
                  <InputGroup className="mt-2">
                    <InputGroupAddon align="inline-start">
                      <MailIcon className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput id="email" value={user.email || ""} />
                  </InputGroup>
                  {!user.email_verified && (
                    <FieldDescription>
                      Email belum terverifikasi. Periksa inbox email Anda.
                    </FieldDescription>
                  )}
                </Field>
              </div>

              {isOwnProfile && (
                <div className="flex items-center gap-4 md:hidden mt-4">
                  {hasChanges && isEditing && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <XIcon className="size-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        <SaveIcon className="size-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </div>
              )}
              <div className="mt-6 p-4  rounded-lg border bg-muted mb-4">
                <h3 className="font-medium mb-2">Informasi Penting</h3>
                <ul className="text-sm  space-y-1">
                  <li>• Perubahan username akan langsung diterapkan</li>
                  <li>• Perubahan email memerlukan verifikasi melalui email</li>
                  <li>• Anda akan logout otomatis setelah mengganti email</li>
                  <li>• Pastikan email baru Anda aktif dan dapat diakses</li>
                </ul>
              </div>

              <DeleteAccount />
              {/*{currentUserClient?.role === "admin" && !isOwnProfile && (
                <div className="pt-4 border-t">
                  <div className="flex flex-col gap-4 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <UserCircle2 className="size-4" />
                      </div>
                      <div>
                        <span className="mb-0">Admin Actions</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <Button variant="destructive">Suspend User</Button>
                      </div>
                      <div className="rounded-lg border p-4">
                        <Button variant="outline">Change Role</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}*/}
            </div>
          </TabsPanel>
        </div>
      </Tabs>
    </div>
  );
}
