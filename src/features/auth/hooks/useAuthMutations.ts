import { useMutation } from "@tanstack/react-query";

import { useSessionStore } from "@/features/auth/state/sessionStore";
import { api } from "@/shared/services/api";

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.signIn(email, password)
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
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: api.auth.completeOnboarding,
    onSuccess: setSession
  });
}

export function useSignOut() {
  const clearSession = useSessionStore((state) => state.clearSession);

  return useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      clearSession();
    }
  });
}
