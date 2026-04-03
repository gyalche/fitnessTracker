import { Text, View } from "react-native";

import { GPSTrackPoint } from "@/shared/types/models";
import { colors } from "@/theme/colors";

export function MapPreviewCard({ points, height = 180 }: { points: GPSTrackPoint[]; height?: number }) {
  return (
    <View
      style={{
        height,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface
      }}
    >
      <Text style={{ color: colors.mutedText }}>
        Route preview unavailable on web{points.length ? ` (${points.length} points)` : ""}
      </Text>
    </View>
  );
}
