// src/hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useSnackbarStore } from "@/store/snackbarStore";
import { LoginFormValues, LoginFormErrors } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";
import { User } from "@/types/common.types";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

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
      const role = userData.role?.toLowerCase();
      if (role !== "admin" && role !== "director") {
        setErrors({ general: "Bu panel faqat adminlar uchun." });
        useSnackbarStore.getState().error("Kirish huquqingiz yo'q");
        setLoading(false);
        return;
      }
      Cookies.set("accessToken", tokens.access_token, {
        expires: 30,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      const user: User = {
        id: String(userData.id),
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phoneNumber,
        email: userData.email ?? undefined,
        avatar: userData.avatar ?? undefined,
        role: role as User["role"],
        isActive: true,
        createdAt: userData.createdAt,
        updatedAt: userData.lastUpdatedAt ?? userData.createdAt,
      };
      useAuthStore.getState().setAuth(user, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      useSnackbarStore.getState().success(`Xush kelibsiz, ${userData.firstName}!`);
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      const status = axiosErr?.response?.status;
      if (status === 400) {
        setErrors({ general: "Telefon raqam yoki parol noto'g'ri" });
        useSnackbarStore.getState().error("Telefon raqam yoki parol noto'g'ri");
      } else if (status === 429) {
        setErrors({ general: "Juda ko'p urinish. Biroz kuting" });
        useSnackbarStore.getState().warning("Juda ko'p urinish");
      } else {
        setErrors({ general: "Xatolik yuz berdi" });
        useSnackbarStore.getState().error("Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  // ← Logout — cookie + store + redirect
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refresh_token");
    useAuthStore.getState().logout();
    useSnackbarStore.getState().success("Tizimdan chiqdingiz");
    window.location.href = "/login"; // router.push emas — to'liq sahifa yangilansin
  };

  return { login, logout, loading, errors, setErrors };
};
