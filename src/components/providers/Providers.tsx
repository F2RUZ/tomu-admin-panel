// src/components/providers/Providers.tsx
"use client";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { useEffect, useRef } from "react";
import theme from "@/lib/theme";
import { useThemeStore } from "@/store/themeStore";
import CustomSnackbar from "@/components/feedback/CustomSnackbar";
import { useAuthStore } from "@/store/authStore";
import AuthService from "@/services/authService";
import Cookies from "js-cookie";

function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const lenisInitialized = useRef(false);
  const authInitialized = useRef(false);

  // Theme sync
  useEffect(() => {
    document.documentElement.setAttribute("data-joy-color-scheme", mode);
  }, [mode]);

  // Lenis
  useEffect(() => {
    if (lenisInitialized.current) return;
    lenisInitialized.current = true;
    let cleanup: (() => void) | undefined;
    import("@/lib/lenis").then(({ initLenis, destroyLenis }) => {
      initLenis();
      cleanup = destroyLenis;
    });
    return () => {
      cleanup?.();
    };
  }, []);

  // Cookie dan token olib store ni to'ldirish
  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;

    const token = Cookies.get("accessToken");
    if (!token) return;

    const store = useAuthStore.getState();
    // Token bor lekin user yo'q — serverdan user ma'lumotlarini olamiz
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
            },
          );
        })
        .catch(() => {
          // Token eskirgan — cookie o'chiramiz
          Cookies.remove("accessToken");
          useAuthStore.getState().logout();
        });
    }
  }, []);

  return (
    <>
      {children}
      <CustomSnackbar />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="dark"
      modeStorageKey="tomu-admin-theme"
      disableNestedContext
    >
      <CssBaseline />
      <AppShell>{children}</AppShell>
    </CssVarsProvider>
  );
}
