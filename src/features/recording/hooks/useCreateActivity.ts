import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/services/api";

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.feed.createActivity,
    onSuccess: async (activity) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["activity", activity.id] })
      ]);
    }
  });
}
