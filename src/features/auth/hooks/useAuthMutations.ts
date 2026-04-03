import { useMutation } from "@tanstack/react-query";

import { useSessionStore } from "@/features/auth/state/sessionStore";
import { api } from "@/shared/services/api";

export function useSignIn() {
  const hydrateSession = useSessionStore((state) => state.hydrateSession);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.signIn(email, password),
    onSuccess: hydrateSession
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: api.auth.signUp
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => api.auth.forgotPassword(email)
  });
}

export function useCompleteOnboarding() {
  const hydrateSession = useSessionStore((state) => state.hydrateSession);

  return useMutation({
    mutationFn: api.auth.completeOnboarding,
    onSuccess: hydrateSession
  });
}

export function useSignOut() {
  const clearSession = useSessionStore((state) => state.signOut);

  return useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      clearSession();
    }
  });
}
