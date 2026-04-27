"use client";

import { create } from "zustand";

export type SnackbarVariant = "success" | "danger" | "warning" | "neutral";

export interface SnackbarItem {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration?: number;
  title?: string;
}

interface SnackbarStore {
  items: SnackbarItem[];
  show: (item: Omit<SnackbarItem, "id">) => void;
  remove: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const generateId = () =>
  `snack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  items: [],

  show: (item) => {
    const id = generateId();
    const newItem: SnackbarItem = { id, duration: 4000, ...item };

    set((state) => ({
      items: [...state.items.slice(-2), newItem], // max 3 at once
    }));

    // Auto remove
    setTimeout(() => {
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
    }, newItem.duration! + 400);
  },

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  success: (message, title) =>
    useSnackbarStore.getState().show({ message, title, variant: "success" }),

  error: (message, title) =>
    useSnackbarStore.getState().show({ message, title, variant: "danger" }),

  warning: (message, title) =>
    useSnackbarStore.getState().show({ message, title, variant: "warning" }),

  info: (message, title) =>
    useSnackbarStore.getState().show({ message, title, variant: "neutral" }),
}));
