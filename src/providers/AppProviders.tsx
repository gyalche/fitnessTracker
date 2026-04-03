import { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useSessionStore } from "@/features/auth/state/sessionStore";
import { bootstrapAuthSession, subscribeToAuthSession } from "@/shared/services/api/supabaseApi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30
    }
  }
});

function SessionBootstrap() {
  const hydrateSession = useSessionStore((state) => state.hydrateSession);
  const clearSession = useSessionStore((state) => state.signOut);
  const markHydrated = useSessionStore((state) => state.markHydrated);

  useEffect(() => {
    let isMounted = true;

    bootstrapAuthSession()
      .then((session) => {
        if (!isMounted) {
          return;
        }

        if (session) {
          hydrateSession(session);
        } else {
          clearSession();
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          clearSession();
        }
      })
      .finally(() => {
        if (isMounted) {
          markHydrated();
        }
      });

    const unsubscribe = subscribeToAuthSession(async (session) => {
      if (!isMounted) {
        return;
      }

      if (session) {
        hydrateSession(session);
      } else {
        clearSession();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [clearSession, hydrateSession, markHydrated]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SessionBootstrap />
          {children}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
