import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { Button } from "@/shared/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={{ paddingVertical: 32, alignItems: "center", gap: 12 }}>
      <AppText variant="subtitle">{title}</AppText>
      <AppText style={{ opacity: 0.75, textAlign: "center" }}>{description}</AppText>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
