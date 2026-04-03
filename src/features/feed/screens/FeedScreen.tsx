import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";

import { useFeed } from "@/features/feed/hooks/useFeed";
import { FeedActivityCard } from "@/features/feed/components/FeedActivityCard";
import { FeedStackParamList } from "@/navigation/types";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { LoadingState } from "@/shared/ui/LoadingState";
import { Screen } from "@/shared/ui/Screen";
import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

type Props = NativeStackScreenProps<FeedStackParamList, "FeedHome">;

export function FeedScreen({ navigation }: Props) {
  const { data, isLoading, isRefetching, refetch, isError } = useFeed();
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Screen
      header={
        <View style={{ marginBottom: 20, marginTop: 8 }}>
          <AppText variant="title">Home Feed</AppText>
          <AppText style={{ color: colors.mutedText, marginTop: 6 }}>
            Route-first workouts, social proof, and training context.
          </AppText>
        </View>
      }
    >
      {isLoading ? <LoadingState label="Loading feed" /> : null}
      {isError ? <ErrorState message="Unable to load your feed." onRetry={() => refetch()} /> : null}
      {!isLoading && !isError ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              title="No activities yet"
              description="Create your first workout from the Record tab and it will appear here."
            />
          }
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <FeedActivityCard
              activity={item}
              athleteName={item.authorName || "Pace Social Athlete"}
              onPress={() => navigation.navigate("ActivityDetail", { activityId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
        />
      ) : null}
    </Screen>
  );
}
