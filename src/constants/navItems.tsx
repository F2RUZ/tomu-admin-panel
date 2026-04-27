import {
  RiDashboardLine,
  RiUserLine,
  RiBookOpenLine,
  RiGroupLine,
  RiVideoLine,
  RiFileListLine,
  RiExchangeLine,
  RiPriceTagLine,
  RiBarChartLine,
  RiMessage2Line,
  RiNotificationLine,
  RiMessage3Line,
  RiRobot2Line,
  RiSettingsLine,
  RiFileTextLine,
} from "react-icons/ri";

import { ROUTES } from "./routes";
import { NavItem } from "@/types/common.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: <RiDashboardLine size={20} />,
  },
  {
    label: "Foydalanuvchilar",
    path: ROUTES.USERS,
    icon: <RiUserLine size={20} />,
    roles: ["admin", "superadmin"],
  },
  {
    label: "Kurslar",
    path: ROUTES.COURSES,
    icon: <RiBookOpenLine size={20} />,
  },
  {
    label: "Guruhlar",
    path: ROUTES.GROUPS,
    icon: <RiGroupLine size={20} />,
  },
  {
    label: "Darslar",
    path: ROUTES.LESSONS,
    icon: <RiVideoLine size={20} />,
  },
  {
    label: "Ma'ruzalar",
    path: ROUTES.LECTURES,
    icon: <RiFileListLine size={20} />,
  },
  {
    label: "Buyurtmalar",
    path: ROUTES.ORDERS,
    icon: <RiFileTextLine size={20} />,
  },
  {
    label: "Tranzaksiyalar",
    path: ROUTES.TRANSACTIONS,
    icon: <RiExchangeLine size={20} />,
  },
  {
    label: "Tariflar",
    path: ROUTES.TARIFFS,
    icon: <RiPriceTagLine size={20} />,
    roles: ["superadmin"],
  },
  {
    label: "Analitika",
    path: ROUTES.ANALYTICS,
    icon: <RiBarChartLine size={20} />,
  },
  {
    label: "Fikr-mulohazalar",
    path: ROUTES.FEEDBACKS,
    icon: <RiMessage2Line size={20} />,
  },
  {
    label: "Bildirishnomalar",
    path: ROUTES.NOTIFICATIONS,
    icon: <RiNotificationLine size={20} />,
  },
  {
    label: "SMS Loglar",
    path: ROUTES.SMS_LOGS,
    icon: <RiMessage3Line size={20} />,
    roles: ["superadmin"],
  },
  {
    label: "Live Chat",
    path: ROUTES.LIVE_CHAT,
    icon: <RiMessage2Line size={20} />,
  },
  {
    label: "AI Boshqaruv",
    path: ROUTES.AI,
    icon: <RiRobot2Line size={20} />,
    roles: ["superadmin"],
  },
  {
    label: "Sozlamalar",
    path: ROUTES.SETTINGS,
    icon: <RiSettingsLine size={20} />,
  },
];

export const NAV_GROUPS = [
  {
    label: "Asosiy",
    items: NAV_ITEMS.slice(0, 2),
  },
  {
    label: "Ta'lim",
    items: NAV_ITEMS.slice(2, 6),
  },
  {
    label: "Moliya",
    items: NAV_ITEMS.slice(6, 9),
  },
  {
    label: "Boshqaruv",
    items: NAV_ITEMS.slice(9),
  },
];