import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <AppText variant="subtitle">{title}</AppText>
      {subtitle ? <AppText style={{ opacity: 0.7, marginTop: 4 }}>{subtitle}</AppText> : null}
    </View>
  );
}
