import { Pressable, PressableProps, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ label, variant = "primary", style, ...props }: ButtonProps) {
  const styles = {
    primary: { textColor: colors.background, borderColor: "#E8C58E", gradient: ["#F1D29E", colors.primary] as const },
    secondary: { textColor: colors.text, borderColor: colors.border, gradient: [colors.surfaceElevated, "#0F1219"] as const },
    ghost: { textColor: colors.primary, borderColor: "rgba(215,180,122,0.35)", gradient: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"] as const }
  }[variant];

  return (
    <Pressable
      style={(state) => {
        const resolvedStyle = typeof style === "function" ? style(state) : style;

        return [
          {
            borderRadius: 20,
            opacity: state.pressed ? 0.9 : 1,
            alignItems: "center",
            transform: [{ scale: state.pressed ? 0.99 : 1 }]
          },
          resolvedStyle
        ];
      }}
      {...props}
    >
      <LinearGradient
        colors={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderRadius: 20,
          alignItems: "center",
          borderWidth: 1,
          borderColor: styles.borderColor
        }}
      >
        <View>
          <AppText style={{ color: styles.textColor, fontWeight: "700", letterSpacing: 0.2 }}>{label}</AppText>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
