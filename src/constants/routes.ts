// src/constants/routes.ts
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: (id: number | string) => `/courses/${id}`,
  USERS: "/users",
  FINANCE: "/finance",
  ORDERS: "/orders",
  FEEDBACKS: "/feedbacks",
  NOTIFICATIONS: "/notifications",
  PAYMENTS_COURSE: "/payments/course",
  PAYMENTS_LIVECHAT: "/payments/livechat",
  LIVE_CHAT: "/live-chat",
} as const;
