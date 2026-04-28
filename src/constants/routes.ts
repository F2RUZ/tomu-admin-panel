// src/constants/routes.ts
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: (id: number | string) => `/courses/${id}`,
  ALPHABET: "/alphabet",
} as const;
