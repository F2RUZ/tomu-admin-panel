import { format, formatDistanceToNow, parseISO } from "date-fns";
import { uz } from "date-fns/locale";

// ─── Currency ────────────────────────────────────────────────────────────────
export const formatCurrency = (
  amount: number,
  currency: string = "UZS",
): string => {
  if (currency === "UZS") {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

// ─── Number ──────────────────────────────────────────────────────────────────
export const formatNumber = (num: number): string =>
  new Intl.NumberFormat("uz-UZ").format(num);

export const formatCompact = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

export const formatPercent = (value: number, total: number): string => {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};

// ─── Date ────────────────────────────────────────────────────────────────────
export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy", { locale: uz });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy, HH:mm", { locale: uz });
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
};

export const formatRelative = (date: string | Date): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: uz });
};

// ─── Phone ───────────────────────────────────────────────────────────────────
export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
};

// ─── Status ──────────────────────────────────────────────────────────────────
export const getOrderStatusColor = (
  status: string,
): "success" | "danger" | "warning" | "neutral" => {
  switch (status) {
    case "paid":
      return "success";
    case "cancelled":
    case "refunded":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
};

export const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "Kutilmoqda",
    paid: "To'langan",
    cancelled: "Bekor qilingan",
    refunded: "Qaytarilgan",
    failed: "Xato",
  };
  return labels[status] ?? status;
};

export const getGroupStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: "Faol",
    inactive: "Nofaol",
    completed: "Tugallangan",
  };
  return labels[status] ?? status;
};

export const getUserRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    teacher: "O'qituvchi",
    student: "O'quvchi",
  };
  return labels[role] ?? role;
};

// ─── String ──────────────────────────────────────────────────────────────────
export const truncate = (str: string, length: number = 40): string =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
