import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActivityDetailScreen } from "@/features/activities/screens/ActivityDetailScreen";
import { FeedScreen } from "@/features/feed/screens/FeedScreen";
import { ExploreScreen } from "@/features/explore/screens/ExploreScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { RecordPlaceholderScreen } from "@/features/recording/screens/RecordPlaceholderScreen";
import {
  ExploreStackParamList,
  FeedStackParamList,
  ProfileStackParamList,
  RootTabParamList
} from "@/navigation/types";
import { colors } from "@/theme/colors";

const Tab = createBottomTabNavigator<RootTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <FeedStack.Screen name="FeedHome" component={FeedScreen} />
      <FeedStack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
    </FeedStack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <ExploreStack.Screen name="ExploreHome" component={ExploreScreen} />
    </ExploreStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: "rgba(215,180,122,0.16)",
          borderTopWidth: 1,
          height: 92,
          paddingTop: 10,
          paddingBottom: 12,
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 26,
          shadowColor: "#000000",
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            FeedTab: "home-outline",
            RecordTab: "radio-button-on-outline",
            ExploreTab: "compass-outline",
            ProfileTab: "person-outline"
          };

          return <Ionicons color={color} name={iconMap[route.name]} size={size} />;
        }
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedStackNavigator} options={{ title: "Home" }} />
      <Tab.Screen name="RecordTab" component={RecordPlaceholderScreen} options={{ title: "Record" }} />
      <Tab.Screen name="ExploreTab" component={ExploreStackNavigator} options={{ title: "Explore" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
