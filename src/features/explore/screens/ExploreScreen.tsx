import { ScrollView, View } from "react-native";

import { useDiscover } from "@/features/explore/hooks/useDiscover";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { LoadingState } from "@/shared/ui/LoadingState";
import { Screen } from "@/shared/ui/Screen";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

export function ExploreScreen() {
  const { data, isLoading } = useDiscover();

  return (
    <Screen scrollable>
      <View style={{ marginTop: 8, gap: 20 }}>
        <View>
          <AppText variant="title">Explore</AppText>
          <AppText style={{ color: colors.mutedText, marginTop: 6 }}>
            Athletes, clubs, challenges, and route discovery foundations.
          </AppText>
        </View>
        {isLoading ? <LoadingState label="Loading discover surface" /> : null}
        {data ? (
          <>
            <Card>
              <SectionHeader title="Challenges" subtitle="Monthly competition and leaderboard entry points." />
              <View style={{ gap: 14 }}>
                {data.challenges.map((challenge) => (
                  <View key={challenge.id}>
                    <AppText variant="subtitle">{challenge.title}</AppText>
                    <AppText style={{ color: colors.mutedText }}>{challenge.description}</AppText>
                  </View>
                ))}
              </View>
            </Card>
            <Card>
              <SectionHeader title="Clubs" subtitle="Group training, social coordination, and event foundations." />
              <View style={{ gap: 14 }}>
                {data.clubs.map((club) => (
                  <View key={club.id}>
                    <AppText variant="subtitle">{club.name}</AppText>
                    <AppText style={{ color: colors.mutedText }}>
                      {club.memberCount} members · {club.city}
                    </AppText>
                  </View>
                ))}
              </View>
            </Card>
            <Card>
              <SectionHeader title="Suggested athletes" subtitle="Follow graph expansion and local community discovery." />
              <View style={{ gap: 14 }}>
                {data.suggestedAthletes.map((athlete) => (
                  <View key={athlete.id} style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                    <Avatar name={athlete.displayName} />
                    <View>
                      <AppText variant="subtitle">{athlete.displayName}</AppText>
                      <AppText style={{ color: colors.mutedText }}>{athlete.city}</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
