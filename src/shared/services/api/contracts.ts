import {
  Activity,
  AppNotification,
  Challenge,
  Club,
  Comment,
  PrivacyLevel,
  Profile,
  PrivacySettings,
  SportType
} from "@/shared/types/models";
import { ActivityCommentBundle, AuthSession, DiscoverPayload, FeedPage } from "@/shared/types/api";

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
}

export interface OnboardingInput {
  preferredSports: SportType[];
  weeklyGoalMinutes: number;
}

export interface CreateActivityInput {
  type: SportType;
  title: string;
  description?: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elevationGainMeters: number;
  visibility: PrivacyLevel;
}

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthSession>;
  signUp(input: SignUpInput): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  completeOnboarding(input: OnboardingInput): Promise<AuthSession>;
  signOut(): Promise<void>;
}

export interface FeedRepository {
  getFeed(cursor?: string): Promise<FeedPage>;
  getActivityById(activityId: string): Promise<Activity>;
  createActivity(input: CreateActivityInput): Promise<Activity>;
  likeActivity(activityId: string): Promise<void>;
  getComments(activityId: string): Promise<ActivityCommentBundle>;
  addComment(activityId: string, body: string): Promise<Comment>;
}

export interface ProfileRepository {
  getCurrentProfile(): Promise<Profile>;
  getPrivacySettings(): Promise<PrivacySettings>;
  updatePrivacySettings(input: Partial<PrivacySettings>): Promise<PrivacySettings>;
}

export interface ExploreRepository {
  getDiscoverData(): Promise<DiscoverPayload>;
  search(query: string): Promise<{
    athletes: Profile[];
    clubs: Club[];
    challenges: Challenge[];
  }>;
}

export interface NotificationRepository {
  listNotifications(): Promise<AppNotification[]>;
}
