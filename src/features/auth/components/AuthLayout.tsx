import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { Screen } from "@/shared/ui/Screen";

interface AuthLayoutProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Screen scrollable>
      <LinearGradient
        colors={["rgba(241,210,158,0.18)", "rgba(24,29,40,0.92)", "rgba(10,12,18,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 34,
          padding: 26,
          marginTop: 8,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: "rgba(215,180,122,0.22)"
        }}
      >
        <AppText variant="caption" style={{ opacity: 0.9, color: "#E7C792" }}>
          {eyebrow}
        </AppText>
        <AppText variant="title" style={{ marginTop: 8 }}>
          {title}
        </AppText>
        <AppText style={{ opacity: 0.75, marginTop: 10, maxWidth: 320 }}>{subtitle}</AppText>
      </LinearGradient>
      <View style={{ gap: 16 }}>{children}</View>
      {footer ? <View style={{ marginTop: 20 }}>{footer}</View> : null}
    </Screen>
  );
}
