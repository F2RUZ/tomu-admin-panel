"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import { LoginFormValues, LoginFormErrors } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";
import { User } from "@/types/common.types";

export const useAuth = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { success, error: showError } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = (values: LoginFormValues): LoginFormErrors => {
    const errs: LoginFormErrors = {};

    if (!values.phoneNumber.trim()) {
      errs.phoneNumber = "Telefon raqam kiritilishi shart";
    } else if (values.phoneNumber.replace(/\D/g, "").length < 12) {
      errs.phoneNumber = "To'liq telefon raqam kiriting";
    }

    if (!values.password.trim()) {
      errs.password = "Parol kiritilishi shart";
    } else if (values.password.length < 6) {
      errs.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    }

    return errs;
  };

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (values: LoginFormValues) => {
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await AuthService.login({
        phoneNumber: values.phoneNumber.replace(/\s/g, ""),
        password: values.password,
      });

      const { data: userData, tokens } = response.data;

      // Admin yoki Director bo'lmasa kirish taqiqlanadi
      if (userData.role !== "ADMIN" && userData.role !== "DIRECTOR") {
        setErrors({
          general: "Bu panel faqat adminlar uchun. Kirish huquqingiz yo'q.",
        });
        showError("Kirish huquqingiz yo'q", "Ruxsat xatosi");
        return;
      }

      // Cookie ga saqlash (middleware uchun)
      Cookies.set("accessToken", tokens.access_token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Zustand store ga saqlash
      const user: User = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phoneNumber,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role.toLowerCase() as User["role"],
        isActive: userData.isActive,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };

      setAuth(user, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      success(`Xush kelibsiz, ${userData.firstName}!`, "Muvaffaqiyat");
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string }; status?: number };
      };

      const status = axiosErr?.response?.status;
      const message = axiosErr?.response?.data?.message;

      if (status === 400) {
        setErrors({ general: "Telefon raqam yoki parol noto'g'ri" });
        showError("Telefon raqam yoki parol noto'g'ri");
      } else if (status === 429) {
        setErrors({ general: "Juda ko'p urinish. Biroz kuting" });
        showError("Juda ko'p urinish. Biroz kuting", "Limit xatosi");
      } else {
        setErrors({
          general: message || "Xatolik yuz berdi. Qayta urinib ko'ring",
        });
        showError(message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    Cookies.remove("accessToken");
    useAuthStore.getState().logout();
    router.push(ROUTES.LOGIN);
  };

  return { login, logout, loading, errors, setErrors };
};
