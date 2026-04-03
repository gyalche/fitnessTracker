import { Pressable, View } from "react-native";

import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { MapPreviewCard } from "@/shared/ui/MapPreviewCard";
import { AppText } from "@/shared/ui/AppText";
import { Activity } from "@/shared/types/models";
import { formatDistance, formatDuration, formatElevation, formatPace } from "@/shared/utils/format";
import { colors } from "@/theme/colors";

export function FeedActivityCard({
  activity,
  athleteName,
  onPress
}: {
  activity: Activity;
  athleteName: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar name={athleteName} />
          <View style={{ flex: 1 }}>
            <AppText variant="subtitle">{athleteName}</AppText>
            <AppText style={{ color: colors.mutedText }}>{activity.title}</AppText>
          </View>
          <AppText variant="caption" style={{ color: colors.primary }}>
            {activity.type.toUpperCase()}
          </AppText>
        </View>
        <MapPreviewCard points={activity.route} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <View style={{ minWidth: "42%" }}>
            <AppText variant="caption" style={{ color: colors.mutedText }}>
              Distance
            </AppText>
            <AppText variant="subtitle">{formatDistance(activity.distanceMeters)}</AppText>
          </View>
          <View style={{ minWidth: "42%" }}>
            <AppText variant="caption" style={{ color: colors.mutedText }}>
              Time
            </AppText>
            <AppText variant="subtitle">{formatDuration(activity.movingTimeSeconds)}</AppText>
          </View>
          <View style={{ minWidth: "42%" }}>
            <AppText variant="caption" style={{ color: colors.mutedText }}>
              Pace / Speed
            </AppText>
            <AppText variant="subtitle">
              {activity.averagePaceSecondsPerKm
                ? formatPace(activity.averagePaceSecondsPerKm)
                : `${activity.averageSpeedKph?.toFixed(1)} kph`}
            </AppText>
          </View>
          <View style={{ minWidth: "42%" }}>
            <AppText variant="caption" style={{ color: colors.mutedText }}>
              Elevation
            </AppText>
            <AppText variant="subtitle">{formatElevation(activity.elevationGainMeters)}</AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <AppText style={{ color: colors.mutedText }}>{activity.kudosCount} likes</AppText>
          <AppText style={{ color: colors.mutedText }}>{activity.commentsCount} comments</AppText>
        </View>
      </Card>
    </Pressable>
  );
}
