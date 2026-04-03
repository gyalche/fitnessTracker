import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

interface MetricPillProps {
  label: string;
  value: string;
}

export function MetricPill({ label, value }: MetricPillProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceElevated,
        borderRadius: 18,
        padding: 14,
        gap: 6
      }}
    >
      <AppText variant="caption" style={{ color: colors.mutedText }}>
        {label}
      </AppText>
      <AppText variant="metric">{value}</AppText>
    </View>
  );
}
