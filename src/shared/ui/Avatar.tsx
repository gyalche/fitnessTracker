import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 44 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primaryMuted,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <AppText style={{ fontWeight: "700" }}>{initials}</AppText>
    </View>
  );
}
