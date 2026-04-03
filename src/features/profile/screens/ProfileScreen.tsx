import { ScrollView, View } from "react-native";

import { useSignOut } from "@/features/auth/hooks/useAuthMutations";
import { useSessionStore } from "@/features/auth/state/sessionStore";
import { useFeed } from "@/features/feed/hooks/useFeed";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useSupabaseStatus } from "@/features/profile/hooks/useSupabaseStatus";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { LoadingState } from "@/shared/ui/LoadingState";
import { MetricPill } from "@/shared/ui/MetricPill";
import { Screen } from "@/shared/ui/Screen";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { AppText } from "@/shared/ui/AppText";
import { formatDistance, formatDuration } from "@/shared/utils/format";
import { colors } from "@/theme/colors";

export function ProfileScreen() {
  const session = useSessionStore((state) => state.session);
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { data, isLoading } = useProfile();
  const { data: feedData } = useFeed();
  const { data: status, isLoading: isCheckingStatus } = useSupabaseStatus();
  const ownActivities =
    feedData?.pages.flatMap((page) => page.items).filter((activity) => activity.userId === session?.user.id) ?? [];
  const totalDistance = ownActivities.reduce((total, item) => total + item.distanceMeters, 0);
  const totalTime = ownActivities.reduce((total, item) => total + item.movingTimeSeconds, 0);

  return (
    <Screen>
      {isLoading ? <LoadingState label="Loading profile" /> : null}
      {data ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={{ gap: 20, marginTop: 8 }}>
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <Avatar name={data.displayName} size={64} />
                <View style={{ flex: 1 }}>
                  <AppText variant="title">{data.displayName}</AppText>
                  <AppText style={{ color: colors.mutedText }}>{data.handle}</AppText>
                  <AppText style={{ marginTop: 8, opacity: 0.8 }}>{data.bio}</AppText>
                </View>
              </View>
            </Card>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <MetricPill label="Followers" value={String(data.followersCount)} />
              <MetricPill label="Following" value={String(data.followingCount)} />
              <MetricPill label="Clubs" value={String(data.clubCount)} />
            </View>
            <Card>
              <SectionHeader title="Backend status" subtitle="Live app health from the connected Supabase project." />
              <AppText style={{ color: colors.mutedText }}>
                {isCheckingStatus
                  ? "Checking Supabase connection..."
                  : status?.connected
                    ? `Connected. Session ${status.hasSession ? "active" : "missing"}, profile row ${status.hasProfile ? "found" : "missing"}.`
                    : "Status unavailable."}
              </AppText>
            </Card>
            <Card>
              <SectionHeader title="Season summary" subtitle="Profile remains backend-ready, with room for personal records and achievement systems." />
              <View style={{ flexDirection: "row", gap: 12 }}>
                <MetricPill label="Volume" value={formatDistance(totalDistance)} />
                <MetricPill label="Time" value={formatDuration(totalTime)} />
              </View>
            </Card>
            <Card>
              <SectionHeader title="Achievements foundation" subtitle="Badges, best efforts, and streaks can attach here without changing the profile shell." />
              <AppText style={{ color: colors.mutedText }}>
                Weekly goal: {data.weeklyGoalMinutes} min. Preferred sports: {data.preferredSports.join(", ")}.
              </AppText>
            </Card>
            <Button label={isSigningOut ? "Signing out..." : "Sign out"} variant="secondary" onPress={() => signOut()} />
          </View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}
