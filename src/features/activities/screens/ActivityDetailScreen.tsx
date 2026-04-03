import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, View } from "react-native";

import { SplitBarChart } from "@/features/activities/components/SplitBarChart";
import { useActivityDetail } from "@/features/activities/hooks/useActivityDetail";
import { FeedStackParamList } from "@/navigation/types";
import { Card } from "@/shared/ui/Card";
import { ErrorState } from "@/shared/ui/ErrorState";
import { LoadingState } from "@/shared/ui/LoadingState";
import { MapPreviewCard } from "@/shared/ui/MapPreviewCard";
import { MetricPill } from "@/shared/ui/MetricPill";
import { Screen } from "@/shared/ui/Screen";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { AppText } from "@/shared/ui/AppText";
import { formatDistance, formatDuration, formatElevation, formatPace } from "@/shared/utils/format";
import { colors } from "@/theme/colors";

type Props = NativeStackScreenProps<FeedStackParamList, "ActivityDetail">;

export function ActivityDetailScreen({ route }: Props) {
  const { data, isLoading, isError, refetch } = useActivityDetail(route.params.activityId);

  return (
    <Screen>
      {isLoading ? <LoadingState label="Loading activity" /> : null}
      {isError ? <ErrorState message="Unable to load the activity." onRetry={() => refetch()} /> : null}
      {data ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          <View style={{ gap: 20, marginTop: 8 }}>
            <View>
              <AppText variant="title">{data.title}</AppText>
              <AppText style={{ color: colors.mutedText, marginTop: 6 }}>{data.description}</AppText>
            </View>
            <MapPreviewCard points={data.route} height={260} />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <MetricPill label="Distance" value={formatDistance(data.distanceMeters)} />
              <MetricPill label="Time" value={formatDuration(data.movingTimeSeconds)} />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <MetricPill
                label="Pace / Speed"
                value={
                  data.averagePaceSecondsPerKm
                    ? formatPace(data.averagePaceSecondsPerKm)
                    : `${data.averageSpeedKph?.toFixed(1)} kph`
                }
              />
              <MetricPill label="Elevation" value={formatElevation(data.elevationGainMeters)} />
            </View>
            <Card>
              <SectionHeader title="Splits" subtitle="Phase 1 split presentation with Phase 2 chart expansion hooks." />
              <View style={{ gap: 12 }}>
                {data.splits.map((split) => (
                  <View
                    key={split.index}
                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <AppText>Kilometer {split.index}</AppText>
                    <AppText>{formatDuration(split.durationSeconds)}</AppText>
                  </View>
                ))}
              </View>
            </Card>
            <Card>
              <SectionHeader title="Elevation trend" subtitle="Phase 1 uses an internal chart component; Skia-backed charts can replace it later without changing the screen contract." />
              <SplitBarChart
                data={data.splits.map((split) => ({
                  label: `KM ${split.index}`,
                  value: split.elevationGainMeters ?? 0
                }))}
              />
            </Card>
          </View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}
