import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

import { colors } from "@/theme/colors";

export function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 28,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: "#000000",
          shadowOpacity: 0.28,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 10
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
