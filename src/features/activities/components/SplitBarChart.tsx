import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

interface SplitBarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function SplitBarChart({ data }: SplitBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={{ gap: 14 }}>
      {data.map((item) => (
        <View key={item.label} style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText variant="caption" style={{ color: colors.mutedText }}>
              {item.label}
            </AppText>
            <AppText variant="caption">{item.value} m</AppText>
          </View>
          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: colors.surfaceElevated,
              overflow: "hidden"
            }}
          >
            <View
              style={{
                width: `${Math.max((item.value / max) * 100, 8)}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: colors.accent
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
