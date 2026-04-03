import {
  Activity,
  AppNotification,
  Challenge,
  Club,
  Comment,
  FollowRelation,
  Profile,
  PrivacySettings,
  User
} from "@/shared/types/models";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  profile: Profile;
  privacy: PrivacySettings;
  tokens: AuthTokens;
}

export interface FeedPage {
  items: Activity[];
  nextCursor?: string;
}

export interface DiscoverPayload {
  clubs: Club[];
  challenges: Challenge[];
  suggestedAthletes: Profile[];
}

export interface ActivityCommentBundle {
  activityId: string;
  comments: Comment[];
}

export interface SocialGraphSnapshot {
  followers: FollowRelation[];
  following: FollowRelation[];
}

export interface NotificationPage {
  items: AppNotification[];
  nextCursor?: string;
}
