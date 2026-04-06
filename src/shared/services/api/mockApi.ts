import {
  mockActivities,
  mockChallenges,
  mockClubs,
  mockPrivacy,
  mockProfile,
  mockSuggestedAthletes,
  mockUser
} from "@/shared/data/mock";
import {
  AuthRepository,
  ExploreRepository,
  FeedRepository,
  NotificationRepository,
  OnboardingInput,
  ProfileRepository,
  SignUpInput
} from "@/shared/services/api/contracts";
import { AppNotification, Comment } from "@/shared/types/models";

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const comments: Comment[] = [
  {
    id: "comment_1",
    activityId: "activity_1",
    authorId: "user_2",
    body: "That closing split was sharp.",
    createdAt: "2026-04-03T07:10:00.000Z"
  }
];

const notifications: AppNotification[] = [
  {
    id: "notif_1",
    userId: "user_1",
    type: "like",
    actorUserId: "user_2",
    activityId: "activity_1",
    message: "Leo gave kudos to your Sunrise Tempo.",
    createdAt: "2026-04-03T07:22:00.000Z"
  }
];

export const mockAuthRepository: AuthRepository = {
  async signIn() {
    await wait();
    return {
      user: mockUser,
      profile: mockProfile,
      privacy: mockPrivacy,
      tokens: {
        accessToken: "mock-access",
        refreshToken: "mock-refresh"
      }
    };
  },
  async signUp(input: SignUpInput) {
    await wait();
    void input;
  },
  async forgotPassword() {
    await wait();
  },
  async completeOnboarding(input: OnboardingInput) {
    await wait();
    return {
      user: mockUser,
      profile: {
        ...mockProfile,
        preferredSports: input.preferredSports,
        weeklyGoalMinutes: input.weeklyGoalMinutes
      },
      privacy: mockPrivacy,
      tokens: {
        accessToken: "mock-access",
        refreshToken: "mock-refresh"
      }
    };
  },
  async signOut() {
    await wait(100);
  }
};

export const mockFeedRepository: FeedRepository = {
  async getFeed() {
    await wait();
    return {
      items: mockActivities
    };
  },
  async getActivityById(activityId: string) {
    await wait();
    return mockActivities.find((activity) => activity.id === activityId) ?? mockActivities[0];
  },
  async createActivity(input) {
    await wait();
    const activity = {
      id: `activity_${mockActivities.length + 1}`,
      userId: mockUser.id,
      type: input.type,
      title: input.title,
      description: input.description,
      startedAt: new Date().toISOString(),
      endedAt: new Date(Date.now() + input.movingTimeSeconds * 1000).toISOString(),
      movingTimeSeconds: input.movingTimeSeconds,
      elapsedTimeSeconds: input.movingTimeSeconds,
      distanceMeters: input.distanceMeters,
      averagePaceSecondsPerKm:
        input.type === "ride" ? undefined : Math.round(input.movingTimeSeconds / Math.max(input.distanceMeters / 1000, 1)),
      averageSpeedKph:
        input.type === "ride"
          ? Number((((input.distanceMeters / 1000) / (input.movingTimeSeconds / 3600)) || 0).toFixed(1))
          : undefined,
      elevationGainMeters: input.elevationGainMeters,
      calories: Math.round(input.distanceMeters / 15),
      route: mockActivities[0]?.route ?? [],
      splits: mockActivities[0]?.splits ?? [],
      visibility: input.visibility,
      kudosCount: 0,
      commentsCount: 0
    };
    mockActivities.unshift(activity);
    return activity;
  },
  async likeActivity() {
    await wait(200);
  },
  async getComments(activityId: string) {
    await wait(200);
    return {
      activityId,
      comments: comments.filter((comment) => comment.activityId === activityId)
    };
  },
  async addComment(activityId: string, body: string) {
    await wait(200);
    const comment = {
      id: `comment_${comments.length + 1}`,
      activityId,
      authorId: mockUser.id,
      body,
      createdAt: new Date().toISOString()
    };
    comments.push(comment);
    return comment;
  }
};

export const mockProfileRepository: ProfileRepository = {
  async getCurrentProfile() {
    await wait();
    return mockProfile;
  },
  async getPrivacySettings() {
    await wait();
    return mockPrivacy;
  },
  async updatePrivacySettings(input) {
    await wait();
    return {
      ...mockPrivacy,
      ...input
    };
  }
};

export const mockExploreRepository: ExploreRepository = {
  async getDiscoverData() {
    await wait();
    return {
      clubs: mockClubs,
      challenges: mockChallenges,
      suggestedAthletes: mockSuggestedAthletes
    };
  },
  async search(query: string) {
    await wait(220);
    const normalized = query.toLowerCase();
    return {
      athletes: mockSuggestedAthletes.filter((athlete) =>
        athlete.displayName.toLowerCase().includes(normalized)
      ),
      clubs: mockClubs.filter((club) => club.name.toLowerCase().includes(normalized)),
      challenges: mockChallenges.filter((challenge) =>
        challenge.title.toLowerCase().includes(normalized)
      )
    };
  }
};

export const mockNotificationRepository: NotificationRepository = {
  async listNotifications() {
    await wait();
    return notifications;
  }
};
