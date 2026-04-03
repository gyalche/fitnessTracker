import { PropsWithChildren, ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme/colors";

interface ScreenProps extends PropsWithChildren {
  scrollable?: boolean;
  header?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function Screen({
  children,
  scrollable = false,
  header,
  refreshing,
  onRefresh
}: ScreenProps) {
  const content = (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 24 }}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <LinearGradient
        colors={["rgba(215,180,122,0.15)", "rgba(138,164,255,0.08)", "transparent"]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.95, y: 0.8 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 220 }}
      />
      <View
        style={{
          position: "absolute",
          top: 48,
          right: -30,
          width: 160,
          height: 160,
          borderRadius: 999,
          backgroundColor: "rgba(215,180,122,0.08)"
        }}
      />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.primary} />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
