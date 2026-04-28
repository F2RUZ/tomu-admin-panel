// src/store/sidebarStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  nestedCollapsed: boolean;
  toggleNested: () => void;
  setNestedCollapsed: (val: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      nestedCollapsed: false,
      toggleNested: () =>
        set((state) => ({ nestedCollapsed: !state.nestedCollapsed })),
      setNestedCollapsed: (val) => set({ nestedCollapsed: val }),
    }),
    { name: "tomu-sidebar-nested" },
  ),
);
