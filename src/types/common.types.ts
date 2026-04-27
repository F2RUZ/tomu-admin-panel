// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Pagination Params ────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// ─── User / Auth ─────────────────────────────────────────────────────────────
export type UserRole = "admin" | "superadmin" | "teacher" | "student";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

// ─── Course ───────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface Order {
  id: string;
  userId: string;
  user?: User;
  courseId?: string;
  course?: Course;
  amount: number;
  status: OrderStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export type TransactionStatus = "pending" | "paid" | "cancelled" | "failed";

export interface Transaction {
  id: string;
  userId: string;
  user?: User;
  amount: number;
  status: TransactionStatus;
  method: string;
  createdAt: string;
}

// ─── Group ────────────────────────────────────────────────────────────────────
export type GroupStatus = "active" | "inactive" | "completed";

export interface Group {
  id: string;
  name: string;
  courseId: string;
  course?: Course;
  teacherId: string;
  teacher?: User;
  status: GroupStatus;
  maxStudents: number;
  studentsCount: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

// ─── Tariff ───────────────────────────────────────────────────────────────────
export interface Tariff {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  features: string[];
  isActive: boolean;
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsSummary {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalCourses: number;
  activeGroups: number;
  newUsersToday: number;
  revenueToday: number;
  ordersToday: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface NotificationPayload {
  title: string;
  body: string;
  userIds?: string[];
  sendToAll?: boolean;
}

// ─── SMS Log ─────────────────────────────────────────────────────────────────
export interface SmsLog {
  id: string;
  phone: string;
  message: string;
  status: "sent" | "failed" | "pending";
  provider: string;
  createdAt: string;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
export interface Feedback {
  id: string;
  userId: string;
  user?: User;
  message: string;
  rating: number;
  createdAt: string;
}

// ─── Table ────────────────────────────────────────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
  roles?: UserRole[];
}

// ─── Select Option ───────────────────────────────────────────────────────────
export interface SelectOption {
  label: string;
  value: string | number;
}
