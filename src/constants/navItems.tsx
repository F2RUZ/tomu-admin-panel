// src/constants/navItems.tsx
import React from "react";
import {
  RiDashboardLine, RiBookOpenLine, RiUserLine,
  RiExchangeLine, RiChat1Line, RiNotification3Line,
  RiMoneyDollarCircleLine, RiMessage3Line,
} from "react-icons/ri";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Asosiy",
    items: [
      { label: "Dashboard", path: ROUTES.DASHBOARD, icon: <RiDashboardLine size={20} /> },
      { label: "Kurslar", path: ROUTES.COURSES, icon: <RiBookOpenLine size={20} /> },
      { label: "Foydalanuvchilar", path: ROUTES.USERS, icon: <RiUserLine size={20} /> },
    ],
  },
  {
    label: "Moliya",
    items: [
      { label: "Buyurtmalar", path: ROUTES.ORDERS, icon: <RiExchangeLine size={20} /> },
      { label: "Kurs to'lovlari", path: ROUTES.PAYMENTS_COURSE, icon: <RiMoneyDollarCircleLine size={20} /> },
      { label: "Live Chat to'lovlari", path: ROUTES.PAYMENTS_LIVECHAT, icon: <RiMoneyDollarCircleLine size={20} /> },
    ],
  },
  {
    label: "Xizmatlar",
    items: [
      { label: "Jonli chat", path: ROUTES.LIVE_CHAT, icon: <RiMessage3Line size={20} /> },
      { label: "Fikrlar", path: ROUTES.FEEDBACKS, icon: <RiChat1Line size={20} /> },
      { label: "Bildirishnomalar", path: ROUTES.NOTIFICATIONS, icon: <RiNotification3Line size={20} /> },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
