import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { slugify } from "@/utils/slugify";

interface CrudConfig<TInput, TRow> {
  tableName: string;
  queryKey: string;
  mapInputToRow: (input: TInput, slug: string, authorId: string) => Partial<TRow>;
  mapUpdateToRow: (input: Partial<TInput>, slug?: string) => Partial<TRow>;
}

export function createCrudHooks<TInput, TRow>(config: CrudConfig<TInput, TRow>) {
  const { tableName, queryKey, mapInputToRow, mapUpdateToRow } = config;

  function useFetchAll(options?: { limit?: number; filters?: Record<string, any> }) {
    return useQuery({
      queryKey: [queryKey, options?.limit, options?.filters],
      queryFn: async () => {
        const supabase = createClient();
        let query = supabase
          .from(tableName)
          .select("*")
          .order("created_at", { ascending: false });

        if (options?.limit) query = query.limit(options.limit);
        
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data as TRow[];
      },
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 24,
    });
  }

  function useFetchById(id: string) {
    return useQuery({
      queryKey: [queryKey, id],
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw new Error(error.message);
        return data as TRow;
      },
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 24,
      enabled: !!id,
    });
  }

  function useFetchBySlug(slug: string) {
    return useQuery({
      queryKey: [queryKey, "slug", slug],
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from(tableName)
          .select("*, author:author_id(id, email, raw_user_meta_data)")
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
      },
      enabled: !!slug,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
      mutationFn: async (input: TInput) => {
        if (!user) throw new Error(`Must login to create ${tableName}`);

        const supabase = createClient();
        const slug = slugify((input as any).title || "");
        const rowData = mapInputToRow(input, slug, user.id);

        const { data, error } = await supabase
          .from(tableName)
          .insert([rowData])
          .select()
          .maybeSingle();

        if (error) throw new Error(error.message);
        return data as TRow;
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        if (data?.id) {
          queryClient.invalidateQueries({ queryKey: [queryKey, data.id] });
        }
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (params: { id: string; input: Partial<TInput> }) => {
        const { id, input } = params;
        const supabase = createClient();

        let slug: string | undefined;
        if ((input as any).title) {
          slug = slugify((input as any).title);
        }

        const updates = mapUpdateToRow(input, slug);

        const { data, error } = await supabase
          .from(tableName)
          .update(updates)
          .eq("id", id)
          .select()
          .maybeSingle();

        if (error) throw new Error(error.message);
        return data as TRow;
      },
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        if (data?.id) {
          queryClient.invalidateQueries({ queryKey: [queryKey, data.id] });
        }
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase.from(tableName).delete().eq("id", id);
        if (error) throw new Error(error.message);
        return id;
      },
      onSuccess: (id) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        queryClient.removeQueries({ queryKey: [queryKey, id] });
      },
    });
  }

  return {
    useFetchAll,
    useFetchById,
    useFetchBySlug,
    useCreate,
    useUpdate,
    useDelete,
  };
}
