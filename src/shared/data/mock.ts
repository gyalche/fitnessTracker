import {
  Activity,
  Challenge,
  Club,
  GPSTrackPoint,
  PrivacySettings,
  Profile,
  User
} from "@/shared/types/models";

const route: GPSTrackPoint[] = [
  { lat: 37.7865, lng: -122.4056, timestamp: "2026-04-03T06:00:00.000Z" },
  { lat: 37.7871, lng: -122.4042, timestamp: "2026-04-03T06:03:00.000Z" },
  { lat: 37.7884, lng: -122.4031, timestamp: "2026-04-03T06:06:00.000Z" },
  { lat: 37.7894, lng: -122.4013, timestamp: "2026-04-03T06:10:00.000Z" },
  { lat: 37.7901, lng: -122.3998, timestamp: "2026-04-03T06:14:00.000Z" }
];

export const mockUser: User = {
  id: "user_1",
  email: "athlete@pacesocial.app",
  createdAt: "2026-02-11T09:00:00.000Z"
};

export const mockPrivacy: PrivacySettings = {
  profileVisibility: "public",
  activityVisibility: "followers",
  mapVisibility: "start_end_hidden",
  allowTagging: true,
  allowClubInvites: true
};

export const mockProfile: Profile = {
  id: "profile_1",
  userId: "user_1",
  displayName: "Maya Carter",
  handle: "@mayacarter",
  bio: "City miles, mountain weekends, and long coffee cooldowns.",
  city: "San Francisco",
  preferredSports: ["run", "ride"],
  weeklyGoalMinutes: 320,
  followersCount: 1284,
  followingCount: 241,
  clubCount: 6
};

export const mockActivities: Activity[] = [
  {
    id: "activity_1",
    userId: "user_1",
    type: "run",
    title: "Sunrise Tempo",
    description: "Steady effort along the waterfront with a strong closing 2 km.",
    startedAt: "2026-04-03T06:00:00.000Z",
    endedAt: "2026-04-03T06:42:00.000Z",
    movingTimeSeconds: 2490,
    elapsedTimeSeconds: 2520,
    distanceMeters: 8420,
    averagePaceSecondsPerKm: 296,
    elevationGainMeters: 88,
    calories: 594,
    route,
    splits: [
      { index: 1, distanceMeters: 1000, durationSeconds: 302, paceSecondsPerKm: 302, elevationGainMeters: 6 },
      { index: 2, distanceMeters: 1000, durationSeconds: 298, paceSecondsPerKm: 298, elevationGainMeters: 12 },
      { index: 3, distanceMeters: 1000, durationSeconds: 294, paceSecondsPerKm: 294, elevationGainMeters: 9 },
      { index: 4, distanceMeters: 1000, durationSeconds: 289, paceSecondsPerKm: 289, elevationGainMeters: 14 }
    ],
    visibility: "followers",
    kudosCount: 43,
    commentsCount: 9
  },
  {
    id: "activity_2",
    userId: "user_2",
    type: "ride",
    title: "Coastal Endurance Ride",
    description: "Headwind out, tailwind home. Perfect recovery spin.",
    startedAt: "2026-04-02T14:00:00.000Z",
    endedAt: "2026-04-02T15:46:00.000Z",
    movingTimeSeconds: 6270,
    elapsedTimeSeconds: 6360,
    distanceMeters: 40210,
    averageSpeedKph: 23.1,
    elevationGainMeters: 342,
    calories: 840,
    route,
    splits: [
      { index: 1, distanceMeters: 5000, durationSeconds: 760, elevationGainMeters: 32 },
      { index: 2, distanceMeters: 5000, durationSeconds: 744, elevationGainMeters: 41 }
    ],
    visibility: "public",
    kudosCount: 71,
    commentsCount: 12
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: "challenge_1",
    title: "April Climb Block",
    description: "Accumulate 2,500 meters of elevation this month.",
    sportTypes: ["run", "ride", "walk"],
    targetDistanceMeters: undefined,
    targetActivityCount: undefined,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    participantCount: 842
  }
];

export const mockClubs: Club[] = [
  {
    id: "club_1",
    name: "Harbor Run Collective",
    description: "Intervals on Tuesdays, long runs on Saturdays.",
    memberCount: 318,
    city: "San Francisco",
    sportTypes: ["run", "walk"]
  },
  {
    id: "club_2",
    name: "Fogline Riders",
    description: "Early start cycling club with weekend climbs.",
    memberCount: 196,
    city: "San Francisco",
    sportTypes: ["ride"]
  }
];

export const mockSuggestedAthletes: Profile[] = [
  {
    id: "profile_2",
    userId: "user_2",
    displayName: "Leo Nguyen",
    handle: "@leonguyen",
    preferredSports: ["ride", "run"],
    followersCount: 632,
    followingCount: 188,
    clubCount: 3,
    city: "Oakland"
  },
  {
    id: "profile_3",
    userId: "user_3",
    displayName: "Ava Brooks",
    handle: "@avabrooks",
    preferredSports: ["walk", "run"],
    followersCount: 421,
    followingCount: 205,
    clubCount: 4,
    city: "Berkeley"
  }
];
