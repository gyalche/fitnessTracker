import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { AppText } from "@/shared/ui/AppText";
import { AuthStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <AuthLayout
      eyebrow="Train with context"
      title="Track effort, build momentum, stay connected."
      subtitle="Pace Social is designed for athletes who want recording, progress, and community in one place."
      footer={<Button label="Create account" onPress={() => navigation.navigate("SignUp")} />}
    >
      <Card>
        <AppText variant="subtitle">Built for movement</AppText>
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppText>Record runs, rides, and walks with live map feedback.</AppText>
          <AppText>Share route-first activity cards with athletes you follow.</AppText>
          <AppText>Compete across clubs, challenges, and future segment efforts.</AppText>
        </View>
      </Card>
      <Button label="Sign in" variant="secondary" onPress={() => navigation.navigate("SignIn")} />
    </AuthLayout>
  );
}
