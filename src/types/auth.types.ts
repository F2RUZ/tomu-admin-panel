// ─── Login ───────────────────────────────────────────────────────────────────
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginUser {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  avatar?: string | null;
  role: "director" | "admin" | "teacher" | "student";
  createdAt: string;
  lastUpdatedAt: string; // ✅ BaseEntity da lastUpdatedAt — to'g'ri
}

export interface LoginResponseData {
  data: LoginUser;
  tokens: LoginTokens;
}

export interface LoginApiResponse {
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

// ─── Refresh ─────────────────────────────────────────────────────────────────
export interface RefreshApiResponse {
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

// ─── Access ──────────────────────────────────────────────────────────────────
export interface AccessRequest {
  accessToken: string;
}

export interface AccessApiResponse {
  statusCode: number;
  message: string;
  data: LoginUser;
}

// ─── Form ────────────────────────────────────────────────────────────────────
export interface LoginFormValues {
  phoneNumber: string;
  password: string;
}

export interface LoginFormErrors {
  phoneNumber?: string;
  password?: string;
  general?: string;
}
