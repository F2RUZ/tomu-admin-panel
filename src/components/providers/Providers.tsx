// src/components/providers/Providers.tsx
"use client";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import theme from "@/lib/theme";
import { useThemeStore } from "@/store/themeStore";
import CustomSnackbar from "@/components/feedback/CustomSnackbar";
import { useAuthStore } from "@/store/authStore";
import AuthService from "@/services/authService";
import Cookies from "js-cookie";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 daqiqa
      retry: 1,
    },
  },
});

function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const lenisInitialized = useRef(false);
  const authInitialized = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-joy-color-scheme", mode);
  }, [mode]);

  useEffect(() => {
    if (lenisInitialized.current) return;
    lenisInitialized.current = true;
    let cleanup: (() => void) | undefined;
    import("@/lib/lenis").then(({ initLenis, destroyLenis }) => {
      initLenis();
      cleanup = destroyLenis;
    });
    return () => { cleanup?.(); };
  }, []);

  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;
    const token = Cookies.get("accessToken");
    if (!token) return;
    const store = useAuthStore.getState();
    if (!store.isAuthenticated || !store.user) {
      AuthService.getCurrentUser(token)
        .then((res) => {
          const userData = res.data;
          useAuthStore.getState().setAuth(
            {
              id: String(userData.id),
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phoneNumber,
              email: userData.email ?? undefined,
              avatar: userData.avatar ?? undefined,
              role: userData.role?.toLowerCase() as any,
              isActive: true,
              createdAt: userData.createdAt,
              updatedAt: userData.lastUpdatedAt ?? userData.createdAt,
            },
            {
              accessToken: token,
              refreshToken: store.tokens?.refreshToken ?? "",
            }
          );
        })
        .catch(() => {
          Cookies.remove("accessToken");
          useAuthStore.getState().logout();
        });
    }
  }, []);

  return (
    <>
      {children}
      <CustomSnackbar />
      {/* React Query Devtools - faqat development da */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider
        theme={theme}
        defaultMode="dark"
        modeStorageKey="tomu-admin-theme"
        disableNestedContext
      >
        <CssBaseline />
        <AppShell>{children}</AppShell>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}
