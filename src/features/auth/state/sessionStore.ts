import { create } from "zustand";

import { AuthSession } from "@/shared/types/api";

export type AuthStatus = "bootstrapping" | "signed_out" | "signed_in";

interface SessionState {
  session: AuthSession | null;
  status: AuthStatus;
  needsOnboarding: boolean;
  setSession: (session: AuthSession | null) => void;
  finishBootstrap: () => void;
  clearSession: () => void;
}

function getNeedsOnboarding(session: AuthSession | null) {
  if (!session) {
    return false;
  }

  return !session.profile.preferredSports.length || !session.profile.weeklyGoalMinutes;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: "bootstrapping",
  needsOnboarding: false,
  setSession: (session) =>
    set({
      session,
      status: session ? "signed_in" : "signed_out",
      needsOnboarding: getNeedsOnboarding(session)
    }),
  finishBootstrap: () =>
    set((state) => ({
      status: state.session ? "signed_in" : "signed_out"
    })),
  clearSession: () =>
    set({
      session: null,
      status: "signed_out",
      needsOnboarding: false
    })
}));
