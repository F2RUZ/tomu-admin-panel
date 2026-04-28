// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { useSnackbarStore } from "@/store/snackbarStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tomubackend.tomu.uz/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().tokens?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const snackbar = useSnackbarStore.getState();
    const status = error.response?.status;

    // 401 — faqat login sahifasida emas bo'lsa redirect
    if (status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      snackbar.error("Bu amalni bajarishga ruxsat yo'q", "Ruxsat xatosi");
    } else if (status === 404) {
      // 404 da snackbar chiqarmaymiz — har sahifada bo'lishi mumkin
    } else if (status && status >= 500) {
      snackbar.error("Server xatosi yuz berdi", "Server xatosi");
    } else if (!error.response) {
      snackbar.error("Internet ulanishini tekshiring", "Tarmoq xatosi");
    }

    return Promise.reject(error);
  },
);

export default api;
