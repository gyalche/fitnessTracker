import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/services/api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.profile.getCurrentProfile
  });
}
