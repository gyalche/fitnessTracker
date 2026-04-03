import {
  liveAuthRepository,
  liveExploreRepository,
  liveFeedRepository,
  liveNotificationRepository,
  liveProfileRepository
} from "@/shared/services/api/supabaseApi";

export const api = {
  auth: liveAuthRepository,
  feed: liveFeedRepository,
  profile: liveProfileRepository,
  explore: liveExploreRepository,
  notifications: liveNotificationRepository
};
