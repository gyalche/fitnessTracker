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

const BOOTSTRAP_TIMEOUT_MS = 6000;

async function bootstrapSessionWithTimeout() {
  return Promise.race([
    bootstrapAuthSession(),
    new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`Auth bootstrap exceeded ${BOOTSTRAP_TIMEOUT_MS}ms. Falling back to signed out state.`);
        resolve(null);
      }, BOOTSTRAP_TIMEOUT_MS);
    })
  ]);
}

function SessionBootstrap() {
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);
  const finishBootstrap = useSessionStore((state) => state.finishBootstrap);

  useEffect(() => {
    let isMounted = true;

    bootstrapSessionWithTimeout()
      .then((session) => {
        if (!isMounted) {
          return;
        }

        if (session) {
          setSession(session);
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
          finishBootstrap();
        }
      });

    const unsubscribe = subscribeToAuthSession((session) => {
      void (async () => {
        if (!isMounted) {
          return;
        }

        if (session) {
          setSession(session);
        } else {
          clearSession();
        }
      })().catch((error) => {
        console.error(error);
        if (isMounted) {
          clearSession();
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [clearSession, finishBootstrap, setSession]);

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
