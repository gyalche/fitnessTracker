import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: { justSignedUp?: boolean } | undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
};

export type FeedStackParamList = {
  FeedHome: undefined;
  ActivityDetail: { activityId: string };
  UserProfile: { userId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  Followers: undefined;
  Following: undefined;
  Settings: undefined;
};

export type ExploreStackParamList = {
  ExploreHome: undefined;
  ClubDetail: { clubId: string };
  ChallengeDetail: { challengeId: string };
};

export type RootTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  RecordTab: undefined;
  ExploreTab: NavigatorScreenParams<ExploreStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<RootTabParamList>;
};
