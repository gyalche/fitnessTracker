import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthSession } from "@/shared/types/api";

interface SessionState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  needsOnboarding: boolean;
  hydrateSession: (session: AuthSession) => void;
  markHydrated: () => void;
  signOut: () => void;
}

function getNeedsOnboarding(session: AuthSession | null) {
  if (!session) {
    return false;
  }

  return !session.profile.preferredSports.length || !session.profile.weeklyGoalMinutes;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      isHydrated: false,
      needsOnboarding: false,
      hydrateSession: (session) =>
        set({
          session,
          isAuthenticated: true,
          needsOnboarding: getNeedsOnboarding(session)
        }),
      markHydrated: () =>
        set({
          isHydrated: true
        }),
      signOut: () =>
        set({
          session: null,
          isAuthenticated: false,
          needsOnboarding: false
        })
    }),
    {
      name: "pace-social-session",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        needsOnboarding: state.needsOnboarding
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      }
    }
  )
);
