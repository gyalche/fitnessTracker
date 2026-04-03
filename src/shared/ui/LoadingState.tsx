import { ActivityIndicator, View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <View style={{ paddingVertical: 32, alignItems: "center", gap: 12 }}>
      <ActivityIndicator color={colors.primary} />
      <AppText>{label}</AppText>
    </View>
  );
}
