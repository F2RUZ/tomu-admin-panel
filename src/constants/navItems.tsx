// src/constants/navItems.tsx
import React from "react";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiUserLine,
  RiChat1Line,
  RiNotification3Line,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[]; // qaysi rollar ko'ra oladi
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  roles: string[]; // guruh ko'rinishi uchun
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Asosiy",
    roles: ["admin", "director", "teacher"],
    items: [
      {
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: <RiDashboardLine size={20} />,
        roles: ["admin", "director", "teacher"],
      },
      {
        label: "Kurslar",
        path: ROUTES.COURSES,
        icon: <RiBookOpenLine size={20} />,
        roles: ["admin", "director", "teacher"],
      },
      {
        label: "Foydalanuvchilar",
        path: ROUTES.USERS,
        icon: <RiUserLine size={20} />,
        roles: ["admin", "director"],
      },
    ],
  },
  {
    label: "Moliya",
    roles: ["admin", "director"],
    items: [
      {
        label: "Moliya",
        path: "/finance",
        icon: <RiMoneyDollarCircleLine size={20} />,
        roles: ["admin", "director"],
      },
    ],
  },
  {
    label: "Xizmatlar",
    roles: ["admin", "director", "teacher"],
    items: [

      {
        label: "Fikrlar",
        path: ROUTES.FEEDBACKS,
        icon: <RiChat1Line size={20} />,
        roles: ["admin", "director"],
      },
      {
        label: "Bildirishnomalar",
        path: ROUTES.NOTIFICATIONS,
        icon: <RiNotification3Line size={20} />,
        roles: ["admin", "director"],
      },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
