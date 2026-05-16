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

const ALLOWED_ROLES = ["admin", "director", "teacher"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

const ROLE_LABELS: Record<AllowedRole, string> = {
  admin: "Admin",
  director: "Direktor",
  teacher: "O'qituvchi",
};

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
      const role = userData.role?.toLowerCase() as string;

      // ── Role tekshiruv ──
      if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
        setErrors({
          general: "Bu panel faqat admin, direktor va o'qituvchilar uchun.",
        });
        useSnackbarStore.getState().error("Kirish huquqingiz yo'q");
        setLoading(false);
        return;
      }

      // ── Cookie (middleware uchun) ──
      Cookies.set("accessToken", tokens.access_token, {
        expires: 30,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // ── User obyekti — backend field nomlari bilan ──
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
        updatedAt: userData.lastUpdatedAt, // ✅ BaseEntity: lastUpdatedAt
      };

      // ── Store ──
      useAuthStore.getState().setAuth(user, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      const roleLabel = ROLE_LABELS[role as AllowedRole];
      useSnackbarStore
        .getState()
        .success(`Xush kelibsiz, ${userData.firstName}! (${roleLabel})`);

      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosErr?.response?.status;
      const serverMessage = axiosErr?.response?.data?.message;

      if (status === 400) {
        const msg = serverMessage || "Telefon raqam yoki parol noto'g'ri";
        setErrors({ general: msg });
        useSnackbarStore.getState().error(msg);
      } else if (status === 429) {
        setErrors({ general: "Juda ko'p urinish. Biroz kuting" });
        useSnackbarStore.getState().warning("Juda ko'p urinish");
      } else if (status === 403) {
        setErrors({ general: "Kirish huquqingiz yo'q" });
        useSnackbarStore.getState().error("Kirish huquqingiz yo'q");
      } else {
        setErrors({ general: "Xatolik yuz berdi, qayta urinib ko'ring" });
        useSnackbarStore.getState().error("Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refresh_token");
    useAuthStore.getState().logout();
    useSnackbarStore.getState().success("Tizimdan muvaffaqiyatli chiqdingiz");
    window.location.href = "/login";
  };

  return { login, logout, loading, errors, setErrors };
};
