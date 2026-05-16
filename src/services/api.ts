// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";
import { useSnackbarStore } from "@/store/snackbarStore";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://213.136.64.206:7777/api";

// ── Oddiy API instance ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Upload API instance (video/fayl yuklash uchun) ────────────────────────────
export const uploadApi = axios.create({
  baseURL: BASE_URL,
  timeout: 900000, // 15 daqiqa
  withCredentials: true,
});

// ── Token olish helper ────────────────────────────────────────────────────────
const getToken = (): string | null => {
  return useAuthStore.getState().tokens?.accessToken ?? null;
};

// ── Request interceptor — oddiy api ──────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Request interceptor — uploadApi ──────────────────────────────────────────
uploadApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Refresh queue ─────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token!);
  });
  failedQueue = [];
};

// ── Response interceptor ──────────────────────────────────────────────────────
const responseInterceptor = async (error: AxiosError<{ message?: string }>) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };
  const status = error.response?.status;
  const snackbar = useSnackbarStore.getState();

  if (status === 401 && !originalRequest._retry) {
    if (
      typeof window !== "undefined" &&
      window.location.pathname.includes("/login")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useAuthStore.getState().tokens?.refreshToken;
      if (!refreshToken) throw new Error("No refresh token");

      const res = await api.get("/auth/refresh", {
        params: { refresh_token: refreshToken },
      });

      const newAccessToken: string = res.data.data.tokens.access_token;
      const newRefreshToken: string = res.data.data.tokens.refresh_token;

      useAuthStore.getState().setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      Cookies.set("accessToken", newAccessToken, {
        expires: 30,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      Cookies.remove("accessToken");
      Cookies.remove("refresh_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (status === 403) {
    snackbar.error("Bu amalni bajarishga ruxsat yo'q", "Ruxsat xatosi");
  } else if (status === 429) {
    snackbar.warning("Juda ko'p so'rov yuborildi, biroz kuting", "Cheklov");
  } else if (status && status >= 500) {
    snackbar.error("Server xatosi yuz berdi", "Server xatosi");
  } else if (!error.response) {
    snackbar.error("Internet ulanishini tekshiring", "Tarmoq xatosi");
  }

  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, responseInterceptor);
uploadApi.interceptors.response.use((r) => r, responseInterceptor);

export default api;
