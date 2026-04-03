import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/services/api";

export function useDiscover() {
  return useQuery({
    queryKey: ["discover"],
    queryFn: api.explore.getDiscoverData
  });
}
