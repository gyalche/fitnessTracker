import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/features/auth/state/sessionStore";

export function useSupabaseStatus() {
  const userId = useSessionStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["supabase-status", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId!)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      return {
        connected: true,
        hasSession: Boolean(session),
        hasProfile: Boolean(profile)
      };
    }
  });
}
