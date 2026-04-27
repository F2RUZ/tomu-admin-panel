"use client";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { useEffect, useRef } from "react";
import theme from "@/lib/theme";
import { useThemeStore } from "@/store/themeStore";
import CustomSnackbar from "@/components/feedback/CustomSnackbar";

function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const lenisInitialized = useRef(false);

  // Theme DOM sync
  useEffect(() => {
    document.documentElement.setAttribute("data-joy-color-scheme", mode);
  }, [mode]);

  // Lenis — faqat bir marta
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
