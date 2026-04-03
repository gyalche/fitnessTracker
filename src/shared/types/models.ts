export type SportType = "run" | "ride" | "walk";
export type PrivacyLevel = "public" | "followers" | "private";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  city?: string;
  preferredSports: SportType[];
  weeklyGoalMinutes?: number;
  followersCount: number;
  followingCount: number;
  clubCount: number;
}

export interface PrivacySettings {
  profileVisibility: PrivacyLevel;
  activityVisibility: PrivacyLevel;
  mapVisibility: "full" | "start_end_hidden" | "private";
  allowTagging: boolean;
  allowClubInvites: boolean;
}

export interface GPSTrackPoint {
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
  speedMps?: number;
  heading?: number;
  timestamp: string;
}

export interface ActivitySplit {
  index: number;
  distanceMeters: number;
  durationSeconds: number;
  paceSecondsPerKm?: number;
  elevationGainMeters?: number;
}

export interface Activity {
  id: string;
  userId: string;
  authorName?: string;
  authorHandle?: string;
  type: SportType;
  title: string;
  description?: string;
  startedAt: string;
  endedAt: string;
  movingTimeSeconds: number;
  elapsedTimeSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPerKm?: number;
  averageSpeedKph?: number;
  elevationGainMeters: number;
  calories?: number;
  route: GPSTrackPoint[];
  splits: ActivitySplit[];
  visibility: PrivacyLevel;
  kudosCount: number;
  commentsCount: number;
  mapPreviewUrl?: string;
}

export interface Route {
  id: string;
  createdByUserId: string;
  title: string;
  sportTypes: SportType[];
  distanceMeters: number;
  elevationGainMeters: number;
  points: GPSTrackPoint[];
}

export interface Segment {
  id: string;
  routeId: string;
  title: string;
  distanceMeters: number;
  elevationGainMeters: number;
  localLegendUserId?: string;
  komUserId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  sportTypes: SportType[];
  targetDistanceMeters?: number;
  targetActivityCount?: number;
  startDate: string;
  endDate: string;
  participantCount: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  memberCount: number;
  city?: string;
  sportTypes: SportType[];
}

export interface Comment {
  id: string;
  activityId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Like {
  id: string;
  activityId: string;
  userId: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow" | "challenge_progress" | "club_invite";
  actorUserId?: string;
  activityId?: string;
  message: string;
  createdAt: string;
  readAt?: string;
}

export interface FollowRelation {
  id: string;
  followerUserId: string;
  followeeUserId: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
