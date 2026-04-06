import { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import {
  AuthRepository,
  CreateActivityInput,
  ExploreRepository,
  FeedRepository,
  NotificationRepository,
  OnboardingInput,
  ProfileRepository,
  SignUpInput
} from "@/shared/services/api/contracts";
import { ActivityCommentBundle, AuthSession, DiscoverPayload, FeedPage } from "@/shared/types/api";
import {
  Activity,
  AppNotification,
  Challenge,
  Club,
  Comment,
  PrivacySettings,
  Profile,
  User
} from "@/shared/types/models";

type ActivityRow = {
  id: string;
  user_id: string;
  type: Activity["type"];
  title: string;
  description?: string | null;
  started_at: string;
  ended_at: string;
  moving_time_seconds: number;
  elapsed_time_seconds: number;
  distance_meters: number;
  average_pace_seconds_per_km?: number | null;
  average_speed_kph?: number | null;
  elevation_gain_meters: number;
  calories?: number | null;
  route: Activity["route"];
  splits: Activity["splits"];
  visibility: Activity["visibility"];
};

type ProfileRow = {
  id: string;
  user_id: string;
  display_name: string;
  handle: string;
  bio?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  preferred_sports: Profile["preferredSports"];
  weekly_goal_minutes?: number | null;
  followers_count: number;
  following_count: number;
  club_count: number;
};

type PrivacyRow = {
  user_id: string;
  profile_visibility: PrivacySettings["profileVisibility"];
  activity_visibility: PrivacySettings["activityVisibility"];
  map_visibility: PrivacySettings["mapVisibility"];
  allow_tagging: boolean;
  allow_club_invites: boolean;
};

type SupabaseErrorLike = {
  message: string;
  code?: string | null;
};

function toSupabaseMessage(error: SupabaseErrorLike) {
  const combined = `${error.code ? `${error.code}: ` : ""}${error.message}`.toLowerCase();

  if (combined.includes("pgrst205") || combined.includes("schema cache") || combined.includes("could not find the table")) {
    return "Supabase schema is not installed yet. Open the Supabase SQL Editor and run docs/supabase.sql from this repo, then restart the app.";
  }

  return error.message;
}

function throwSupabaseError(error: SupabaseErrorLike) {
  throw new Error(toSupabaseMessage(error));
}

function requireData<T>(value: T | null, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

function toAppUser(user: SupabaseUser): User {
  return {
    id: user.id,
    email: user.email || "",
    createdAt: user.created_at
  };
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    handle: row.handle,
    bio: row.bio || undefined,
    avatarUrl: row.avatar_url || undefined,
    city: row.city || undefined,
    preferredSports: row.preferred_sports || [],
    weeklyGoalMinutes: row.weekly_goal_minutes || undefined,
    followersCount: row.followers_count,
    followingCount: row.following_count,
    clubCount: row.club_count
  };
}

function toPrivacy(row: PrivacyRow): PrivacySettings {
  return {
    profileVisibility: row.profile_visibility,
    activityVisibility: row.activity_visibility,
    mapVisibility: row.map_visibility,
    allowTagging: row.allow_tagging,
    allowClubInvites: row.allow_club_invites
  };
}

function toActivity(row: ActivityRow, author?: Profile): Activity {
  return {
    id: row.id,
    userId: row.user_id,
    authorName: author?.displayName,
    authorHandle: author?.handle,
    type: row.type,
    title: row.title,
    description: row.description || undefined,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    movingTimeSeconds: row.moving_time_seconds,
    elapsedTimeSeconds: row.elapsed_time_seconds,
    distanceMeters: row.distance_meters,
    averagePaceSecondsPerKm: row.average_pace_seconds_per_km || undefined,
    averageSpeedKph: row.average_speed_kph || undefined,
    elevationGainMeters: row.elevation_gain_meters,
    calories: row.calories || undefined,
    route: row.route || [],
    splits: row.splits || [],
    visibility: row.visibility,
    kudosCount: 0,
    commentsCount: 0
  };
}

function slugifyHandle(displayName: string) {
  return `@${displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18) || "athlete"}`;
}

function buildRoute(distanceMeters: number, startedAt: string, movingTimeSeconds: number): Activity["route"] {
  const points = 5;
  const timeStep = movingTimeSeconds / Math.max(points - 1, 1);

  return Array.from({ length: points }, (_, index) => ({
    lat: Number((37.7865 + index * 0.0019).toFixed(6)),
    lng: Number((-122.4056 + index * 0.0021).toFixed(6)),
    timestamp: new Date(new Date(startedAt).getTime() + timeStep * 1000 * index).toISOString(),
    speedMps: Number((distanceMeters / Math.max(movingTimeSeconds, 1)).toFixed(2))
  }));
}

function buildSplits(input: CreateActivityInput): Activity["splits"] {
  const splitDistance = input.type === "ride" ? 5000 : 1000;
  const count = Math.max(1, Math.round(input.distanceMeters / splitDistance));

  return Array.from({ length: count }, (_, index) => {
    const distanceMeters = Math.round(input.distanceMeters / count);
    const durationSeconds = Math.round(input.movingTimeSeconds / count);
    const split = {
      index: index + 1,
      distanceMeters,
      durationSeconds,
      elevationGainMeters: Math.round(input.elevationGainMeters / count)
    };

    if (input.type !== "ride") {
      return {
        ...split,
        paceSecondsPerKm: Math.round(durationSeconds / Math.max(distanceMeters / 1000, 1))
      };
    }

    return split;
  });
}

async function createStarterActivity(userId: string) {
  const startedAt = new Date().toISOString();
  const movingTimeSeconds = 1680;
  const distanceMeters = 4800;
  const elevationGainMeters = 42;

  const { error } = await supabase.from("activities").insert({
    user_id: userId,
    type: "run",
    title: "First Supabase Sync Run",
    description: "Starter activity created after onboarding so your feed has a real end-to-end record.",
    started_at: startedAt,
    ended_at: new Date(new Date(startedAt).getTime() + movingTimeSeconds * 1000).toISOString(),
    moving_time_seconds: movingTimeSeconds,
    elapsed_time_seconds: movingTimeSeconds,
    distance_meters: distanceMeters,
    average_pace_seconds_per_km: Math.round(movingTimeSeconds / (distanceMeters / 1000)),
    average_speed_kph: null,
    elevation_gain_meters: elevationGainMeters,
    calories: 320,
    route: buildRoute(distanceMeters, startedAt, movingTimeSeconds),
    splits: buildSplits({
      type: "run",
      title: "First Supabase Sync Run",
      description: "Starter activity created after onboarding so your feed has a real end-to-end record.",
      distanceMeters,
      movingTimeSeconds,
      elevationGainMeters,
      visibility: "followers"
    }),
    visibility: "followers"
  });

  if (error) {
    throwSupabaseError(error);
  }
}

async function ensureStarterActivity(userId: string) {
  const { count, error } = await supabase
    .from("activities")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throwSupabaseError(error);
  }

  if (!count) {
    await createStarterActivity(userId);
  }
}

async function fetchProfileByUserId(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single();

  if (error) {
    throwSupabaseError(error);
  }

  return toProfile(data as ProfileRow);
}

async function fetchPrivacyByUserId(userId: string) {
  const { data, error } = await supabase
    .from("privacy_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throwSupabaseError(error);
  }

  return toPrivacy(data as PrivacyRow);
}

async function waitForBootstrapRows(userId: string, retries = 12, delayMs = 350) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const [profile, privacy] = await Promise.all([fetchProfileByUserId(userId), fetchPrivacyByUserId(userId)]);
      return { profile, privacy };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unable to load Supabase bootstrap rows.");
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    lastError?.message ||
      "Profile bootstrap rows are missing. Run docs/supabase.sql so the auth.users trigger can create profiles and privacy_settings rows."
  );
}

async function fetchLikeCounts(activityIds: string[]) {
  if (!activityIds.length) {
    return new Map<string, number>();
  }

  const { data, error } = await supabase.from("likes").select("activity_id").in("activity_id", activityIds);

  if (error) {
    throwSupabaseError(error);
  }

  const counts = new Map<string, number>();

  for (const row of data || []) {
    const activityId = row.activity_id as string;
    counts.set(activityId, (counts.get(activityId) || 0) + 1);
  }

  return counts;
}

async function fetchCommentCounts(activityIds: string[]) {
  if (!activityIds.length) {
    return new Map<string, number>();
  }

  const { data, error } = await supabase.from("comments").select("activity_id").in("activity_id", activityIds);

  if (error) {
    throwSupabaseError(error);
  }

  const counts = new Map<string, number>();

  for (const row of data || []) {
    const activityId = row.activity_id as string;
    counts.set(activityId, (counts.get(activityId) || 0) + 1);
  }

  return counts;
}

async function hydrateActivities(rows: ActivityRow[]) {
  const userIds = Array.from(new Set(rows.map((row) => row.user_id)));
  const activityIds = rows.map((row) => row.id);

  const [{ data: profileRows, error: profileError }, likeCounts, commentCounts] = await Promise.all([
    supabase.from("profiles").select("*").in("user_id", userIds),
    fetchLikeCounts(activityIds),
    fetchCommentCounts(activityIds)
  ]);

  if (profileError) {
    throwSupabaseError(profileError);
  }

  const profileMap = new Map<string, Profile>(
    ((profileRows as ProfileRow[] | null) || []).map((row) => [row.user_id, toProfile(row)])
  );

  return rows.map((row) => ({
    ...toActivity(row, profileMap.get(row.user_id)),
    kudosCount: likeCounts.get(row.id) || 0,
    commentsCount: commentCounts.get(row.id) || 0
  }));
}

async function getCurrentSupabaseUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    throwSupabaseError(error);
  }

  return requireData(user, "Not signed in.");
}

async function buildAuthSession(user: SupabaseUser, accessToken?: string): Promise<AuthSession> {
  const { profile, privacy } = await waitForBootstrapRows(user.id);

  return {
    user: toAppUser(user),
    profile,
    privacy,
    tokens: {
      accessToken: accessToken || "",
      refreshToken: accessToken || ""
    }
  };
}

export async function bootstrapAuthSession(): Promise<AuthSession | null> {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    throwSupabaseError(error);
  }

  if (!session?.user) {
    return null;
  }

  return buildAuthSession(session.user, session.access_token);
}

export function subscribeToAuthSession(
  callback: (authSession: AuthSession | null) => Promise<void> | void
) {
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      await callback(null);
      return;
    }

    const authSession = await buildAuthSession(session.user, session.access_token);
    await callback(authSession);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}

export const liveAuthRepository: AuthRepository = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throwSupabaseError(error);
    }

    return buildAuthSession(requireData(data.user, "Unable to load user after sign-in."), data.session?.access_token);
  },
  async signUp(input: SignUpInput) {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          display_name: input.displayName
        }
      }
    });

    if (error) {
      throwSupabaseError(error);
    }

    if (!data.user || !data.session) {
      throw new Error("Supabase sign-up completed without an active session. Disable email confirmation or verify the email, then sign in.");
    }

    return buildAuthSession(data.user, data.session.access_token);
  },
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throwSupabaseError(error);
    }
  },
  async completeOnboarding(input: OnboardingInput) {
    const user = await getCurrentSupabaseUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        preferred_sports: input.preferredSports,
        weekly_goal_minutes: input.weeklyGoalMinutes
      })
      .eq("user_id", user.id);

    if (error) {
      throwSupabaseError(error);
    }

    await ensureStarterActivity(user.id);

    const {
      data: { session }
    } = await supabase.auth.getSession();

    return buildAuthSession(user, session?.access_token);
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throwSupabaseError(error);
    }
  }
};

export const liveFeedRepository: FeedRepository = {
  async getFeed(): Promise<FeedPage> {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) {
      throwSupabaseError(error);
    }

    return {
      items: await hydrateActivities((data as ActivityRow[] | null) || [])
    };
  },
  async getActivityById(activityId: string) {
    const { data, error } = await supabase.from("activities").select("*").eq("id", activityId).single();

    if (error) {
      throwSupabaseError(error);
    }

    const [activity] = await hydrateActivities([data as ActivityRow]);
    return activity;
  },
  async createActivity(input: CreateActivityInput) {
    const user = await getCurrentSupabaseUser();
    const startedAt = new Date().toISOString();
    const endedAt = new Date(new Date(startedAt).getTime() + input.movingTimeSeconds * 1000).toISOString();
    const route = buildRoute(input.distanceMeters, startedAt, input.movingTimeSeconds);
    const splits = buildSplits(input);
    const activityPayload = {
      user_id: user.id,
      type: input.type,
      title: input.title,
      description: input.description || null,
      started_at: startedAt,
      ended_at: endedAt,
      moving_time_seconds: Math.round(input.movingTimeSeconds),
      elapsed_time_seconds: Math.round(input.movingTimeSeconds),
      distance_meters: Math.round(input.distanceMeters),
      average_pace_seconds_per_km:
        input.type === "ride"
          ? null
          : Math.round(input.movingTimeSeconds / Math.max(input.distanceMeters / 1000, 1)),
      average_speed_kph:
        input.type === "ride"
          ? Number((((input.distanceMeters / 1000) / (input.movingTimeSeconds / 3600)) || 0).toFixed(1))
          : null,
      elevation_gain_meters: Math.round(input.elevationGainMeters),
      calories: Math.round(input.distanceMeters / 15),
      route,
      splits,
      visibility: input.visibility
    };

    const { data, error } = await supabase.from("activities").insert(activityPayload).select("*").single();

    if (error) {
      throw new Error(error.message);
    }

    const [activity] = await hydrateActivities([data as ActivityRow]);
    return activity;
  },
  async likeActivity(activityId: string) {
    const user = await getCurrentSupabaseUser();
    const { error } = await supabase
      .from("likes")
      .upsert(
        {
          activity_id: activityId,
          user_id: user.id
        },
        {
          onConflict: "activity_id,user_id"
        }
      );

    if (error) {
      throw new Error(error.message);
    }
  },
  async getComments(activityId: string): Promise<ActivityCommentBundle> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("activity_id", activityId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return {
      activityId,
      comments: ((data as any[]) || []).map((row) => ({
        id: row.id,
        activityId: row.activity_id,
        authorId: row.author_id,
        body: row.body,
        createdAt: row.created_at
      }))
    };
  },
  async addComment(activityId: string, body: string): Promise<Comment> {
    const user = await getCurrentSupabaseUser();
    const { data, error } = await supabase
      .from("comments")
      .insert({
        activity_id: activityId,
        author_id: user.id,
        body
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      activityId: data.activity_id,
      authorId: data.author_id,
      body: data.body,
      createdAt: data.created_at
    };
  }
};

export const liveProfileRepository: ProfileRepository = {
  async getCurrentProfile() {
    const user = await getCurrentSupabaseUser();
    return fetchProfileByUserId(user.id);
  },
  async getPrivacySettings() {
    const user = await getCurrentSupabaseUser();
    return fetchPrivacyByUserId(user.id);
  },
  async updatePrivacySettings(input: Partial<PrivacySettings>) {
    const user = await getCurrentSupabaseUser();
    const payload = {
      profile_visibility: input.profileVisibility,
      activity_visibility: input.activityVisibility,
      map_visibility: input.mapVisibility,
      allow_tagging: input.allowTagging,
      allow_club_invites: input.allowClubInvites
    };

    const { data, error } = await supabase
      .from("privacy_settings")
      .update(payload)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return toPrivacy(data as PrivacyRow);
  }
};

export const liveExploreRepository: ExploreRepository = {
  async getDiscoverData(): Promise<DiscoverPayload> {
    const currentUser = await getCurrentSupabaseUser();
    const [{ data: clubs, error: clubsError }, { data: challenges, error: challengesError }, { data: athletes, error: athletesError }] =
      await Promise.all([
        supabase.from("clubs").select("*").order("member_count", { ascending: false }).limit(12),
        supabase.from("challenges").select("*").order("start_date", { ascending: false }).limit(12),
        supabase.from("profiles").select("*").neq("user_id", currentUser.id).limit(12)
      ]);

    if (clubsError) {
      throwSupabaseError(clubsError);
    }

    if (challengesError) {
      throwSupabaseError(challengesError);
    }

    if (athletesError) {
      throwSupabaseError(athletesError);
    }

    return {
      clubs: ((clubs as any[]) || []).map(
        (row): Club => ({
          id: row.id,
          name: row.name,
          description: row.description,
          coverImageUrl: row.cover_image_url || undefined,
          memberCount: row.member_count,
          city: row.city || undefined,
          sportTypes: row.sport_types || []
        })
      ),
      challenges: ((challenges as any[]) || []).map(
        (row): Challenge => ({
          id: row.id,
          title: row.title,
          description: row.description,
          sportTypes: row.sport_types || [],
          targetDistanceMeters: row.target_distance_meters || undefined,
          targetActivityCount: row.target_activity_count || undefined,
          startDate: row.start_date,
          endDate: row.end_date,
          participantCount: row.participant_count
        })
      ),
      suggestedAthletes: ((athletes as ProfileRow[] | null) || []).map(toProfile)
    };
  },
  async search(query: string) {
    const term = `%${query}%`;
    const [{ data: athletes, error: athletesError }, { data: clubs, error: clubsError }, { data: challenges, error: challengesError }] =
      await Promise.all([
        supabase.from("profiles").select("*").ilike("display_name", term).limit(10),
        supabase.from("clubs").select("*").ilike("name", term).limit(10),
        supabase.from("challenges").select("*").ilike("title", term).limit(10)
      ]);

    if (athletesError) {
      throwSupabaseError(athletesError);
    }

    if (clubsError) {
      throwSupabaseError(clubsError);
    }

    if (challengesError) {
      throwSupabaseError(challengesError);
    }

    return {
      athletes: ((athletes as ProfileRow[] | null) || []).map(toProfile),
      clubs: ((clubs as any[]) || []).map(
        (row): Club => ({
          id: row.id,
          name: row.name,
          description: row.description,
          coverImageUrl: row.cover_image_url || undefined,
          memberCount: row.member_count,
          city: row.city || undefined,
          sportTypes: row.sport_types || []
        })
      ),
      challenges: ((challenges as any[]) || []).map(
        (row): Challenge => ({
          id: row.id,
          title: row.title,
          description: row.description,
          sportTypes: row.sport_types || [],
          targetDistanceMeters: row.target_distance_meters || undefined,
          targetActivityCount: row.target_activity_count || undefined,
          startDate: row.start_date,
          endDate: row.end_date,
          participantCount: row.participant_count
        })
      )
    };
  }
};

export const liveNotificationRepository: NotificationRepository = {
  async listNotifications() {
    const user = await getCurrentSupabaseUser();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throwSupabaseError(error);
    }

    return ((data as any[]) || []).map(
      (row): AppNotification => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        actorUserId: row.actor_user_id || undefined,
        activityId: row.activity_id || undefined,
        message: row.message,
        createdAt: row.created_at,
        readAt: row.read_at || undefined
      })
    );
  }
};
