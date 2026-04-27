"use client";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { useEffect } from "react";
import theme from "@/lib/theme";
import { useThemeStore } from "@/store/themeStore";
import { useLenis } from "@/lib/lenis";
import CustomSnackbar from "@/components/feedback/CustomSnackbar";

// ─── Inner client component (hooks ishlatish uchun) ───────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();

  // Lenis smooth scroll
  useLenis();

  // Theme DOM sync
  useEffect(() => {
    document.documentElement.setAttribute("data-joy-color-scheme", mode);
  }, [mode]);

  return (
    <>
      {children}
      <CustomSnackbar />
    </>
  );
}

// ─── Root Providers ───────────────────────────────────────────────────────────
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
