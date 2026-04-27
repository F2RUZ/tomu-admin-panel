import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useSnackbarStore } from "@/store/snackbarStore";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
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
  async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    const snackbar = useSnackbarStore.getState();
    const authStore = useAuthStore.getState();
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 - refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = authStore.tokens?.refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        authStore.setTokens(data.data);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        authStore.logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      snackbar.error("Bu amalni bajarishga ruxsat yo'q", "Ruxsat xatosi");
    }
    if (error.response?.status === 404) {
      snackbar.warning("Ma'lumot topilmadi");
    }
    if (error.response?.status && error.response.status >= 500) {
      snackbar.error("Server xatosi yuz berdi", "Server xatosi");
    }
    if (!error.response) {
      snackbar.error("Internet ulanishini tekshiring", "Tarmoq xatosi");
    }

    return Promise.reject(error);
  },
);

export default api;
