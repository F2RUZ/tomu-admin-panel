// src/constants/navItems.tsx
import React from "react";
import { RiDashboardLine, RiBookOpenLine, RiText } from "react-icons/ri";
import { ROUTES } from "./routes";
import { NavItem } from "@/types/common.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: <RiDashboardLine size={20} />,
  },
  {
    label: "Kurslar",
    path: ROUTES.COURSES,
    icon: <RiBookOpenLine size={20} />,
  },
];

export const NAV_GROUPS = [
  {
    label: "Asosiy",
    items: NAV_ITEMS,
  },
];
