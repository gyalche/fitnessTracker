import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/services/api";

export function useActivityDetail(activityId: string) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => api.feed.getActivityById(activityId)
  });
}
