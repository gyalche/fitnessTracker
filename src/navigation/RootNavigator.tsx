import { NavigationContainer, DarkTheme, Theme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingScreen } from "@/features/auth/screens/OnboardingScreen";
import { AppNavigator } from "@/navigation/stacks/AppNavigator";
import { AuthNavigator } from "@/navigation/stacks/AuthNavigator";
import { useSessionStore } from "@/features/auth/state/sessionStore";
import { InitialSplash } from "@/shared/ui/InitialSplash";
import { colors } from "@/theme/colors";

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.text
  }
};

export function RootNavigator() {
  const isHydrated = useSessionStore((state) => state.isHydrated);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const needsOnboarding = useSessionStore((state) => state.needsOnboarding);

  if (!isHydrated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <InitialSplash />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!isAuthenticated ? <AuthNavigator /> : needsOnboarding ? <OnboardingScreen /> : <AppNavigator />}
    </NavigationContainer>
  );
}
