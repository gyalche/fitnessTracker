import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

export function InitialSplash() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 }}>
      <LinearGradient
        colors={["rgba(241,210,158,0.26)", "rgba(17,20,28,0.92)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          maxWidth: 360,
          borderRadius: 36,
          paddingVertical: 42,
          paddingHorizontal: 28,
          borderWidth: 1,
          borderColor: "rgba(215,180,122,0.22)"
        }}
      >
        <AppText variant="caption" style={{ color: colors.primary }}>
          Pace Social
        </AppText>
        <AppText variant="title" style={{ marginTop: 10 }}>
          Premium training, quietly connected.
        </AppText>
        <AppText style={{ color: colors.mutedText, marginTop: 12 }}>
          Syncing your session, profile, and activity graph.
        </AppText>
      </LinearGradient>
    </View>
  );
}
