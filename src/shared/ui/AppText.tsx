import { ReactNode } from "react";
import { Text, TextProps } from "react-native";

import { colors } from "@/theme/colors";

interface AppTextProps extends TextProps {
  children: ReactNode;
  variant?: "title" | "subtitle" | "body" | "caption" | "metric";
}

export function AppText({ children, style, variant = "body", ...props }: AppTextProps) {
  const variantStyle = {
    title: {
      fontSize: 30,
      fontWeight: "700" as const,
      lineHeight: 36,
      letterSpacing: -0.7,
      fontFamily: "Georgia"
    },
    subtitle: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24, letterSpacing: -0.2 },
    body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
    caption: { fontSize: 12, fontWeight: "600" as const, lineHeight: 17, letterSpacing: 1.2, textTransform: "uppercase" as const },
    metric: {
      fontSize: 26,
      fontWeight: "700" as const,
      lineHeight: 30,
      letterSpacing: -0.5,
      fontFamily: "Georgia"
    }
  }[variant];

  return (
    <Text
      style={[
        {
          color: colors.text
        },
        variantStyle,
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
