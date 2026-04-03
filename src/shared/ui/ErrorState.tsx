import { View } from "react-native";

import { AppText } from "@/shared/ui/AppText";
import { Button } from "@/shared/ui/Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ paddingVertical: 32, alignItems: "center", gap: 12 }}>
      <AppText variant="subtitle">Something went wrong</AppText>
      <AppText style={{ opacity: 0.7, textAlign: "center" }}>{message}</AppText>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}
