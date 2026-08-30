import { createCrudHooks } from "./content/factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

// --- Blogs ---

interface BlogInput {
  title: string;
  content: string;
  category: string[];
  image?: { url: string; path: string } | null;
}

export const {
  useFetchAll: useBlogsQuery,
  useFetchById: useBlogQueryById,
  useCreate: useCreateBlog,
  useUpdate: useUpdateBlog,
  useDelete: useDeleteBlog,
} = createCrudHooks<BlogInput, any>({
  tableName: "blogs",
  queryKey: "blogs",
  mapInputToRow: (input, slug, authorId) => ({
    title: input.title,
    slug,
    content: input.content,
    category: input.category,
    image_url: input.image?.url ?? null,
    image_path: input.image?.path ?? null,
    author_id: authorId,
  }),
  mapUpdateToRow: (input, slug) => {
    const updates: any = {};
    if (input.title) {
      updates.title = input.title;
      updates.slug = slug;
    }
    if (input.content !== undefined) updates.content = input.content;
    if (input.category !== undefined) updates.category = input.category;
    if (input.image !== undefined) {
      updates.image_url = input.image?.url ?? null;
      updates.image_path = input.image?.path ?? null;
    }
    return updates;
  },
});

export function useToggleArchiveBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_archived }: { id: string; is_archived: boolean }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blogs")
        .update({ is_archived })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

// --- Announcements ---

interface AnnouncementInput {
  title: string;
  content: string;
}

export const {
  useFetchAll: useAnnouncements,
  useFetchBySlug: useAnnouncement,
  useCreate: useCreateAnnouncement,
  useUpdate: useUpdateAnnouncement,
  useDelete: useDeleteAnnouncement,
} = createCrudHooks<AnnouncementInput, any>({
  tableName: "announcements",
  queryKey: "announcements",
  mapInputToRow: (input, slug, authorId) => ({
    title: input.title,
    slug,
    content: input.content,
    author_id: authorId,
  }),
  mapUpdateToRow: (input, slug) => {
    const updates: any = {};
    if (input.title) {
      updates.title = input.title;
      updates.slug = slug;
    }
    if (input.content !== undefined) updates.content = input.content;
    return updates;
  },
});
