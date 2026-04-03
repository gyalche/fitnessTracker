import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "@/shared/services/api";

export function useFeed() {
  return useInfiniteQuery({
    initialPageParam: undefined as string | undefined,
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => api.feed.getFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
}
