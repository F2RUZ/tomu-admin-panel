export const ROUTES = {
  // Auth
  LOGIN: "/login",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Users
  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,

  // Courses
  COURSES: "/courses",
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  COURSE_CREATE: "/courses/create",

  // Groups
  GROUPS: "/groups",
  GROUP_DETAIL: (id: string) => `/groups/${id}`,
  GROUP_CREATE: "/groups/create",

  // Lectures
  LECTURES: "/lectures",
  LECTURE_DETAIL: (id: string) => `/lectures/${id}`,

  // Lessons
  LESSONS: "/lessons",
  LESSON_DETAIL: (id: string) => `/lessons/${id}`,

  // Orders
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,

  // Transactions
  TRANSACTIONS: "/transactions",

  // Tariffs
  TARIFFS: "/tariffs",
  TARIFF_CREATE: "/tariffs/create",

  // Analytics
  ANALYTICS: "/analytics",

  // Feedbacks
  FEEDBACKS: "/feedbacks",

  // Notifications
  NOTIFICATIONS: "/notifications",

  // SMS Logs
  SMS_LOGS: "/sms-logs",

  // Live Chat
  LIVE_CHAT: "/live-chat",

  // AI
  AI: "/ai",

  // Settings
  SETTINGS: "/settings",
} as const;
