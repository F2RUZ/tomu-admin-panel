"use client";

import { useSnackbarStore } from "@/store/snackbarStore";

export const useSnackbar = () => {
  const { success, error, warning, info, show, remove } = useSnackbarStore();

  return {
    success,
    error,
    warning,
    info,
    show,
    remove,
  };
};
