"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "dark",

      toggleTheme: () => {
        const next = get().mode === "dark" ? "light" : "dark";
        set({ mode: next });

        // MUI Joy colorScheme sync
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-joy-color-scheme", next);
        }
      },

      setTheme: (mode: ThemeMode) => {
        set({ mode });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-joy-color-scheme", mode);
        }
      },
    }),
    {
      name: "tomu-admin-color-scheme",
      onRehydrateStorage: () => (state) => {
        // Sync DOM after hydration
        if (state && typeof document !== "undefined") {
          document.documentElement.setAttribute(
            "data-joy-color-scheme",
            state.mode,
          );
        }
      },
    },
  ),
);
