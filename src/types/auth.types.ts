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
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  role: "DIRECTOR" | "ADMIN" | "TEACHER" | "STUDENT";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

// ─── Access (current user) ────────────────────────────────────────────────────
export interface AccessRequest {
  accessToken: string;
}

export interface AccessApiResponse {
  statusCode: number;
  message: string;
  data: LoginUser;
}

// ─── Form state ───────────────────────────────────────────────────────────────
export interface LoginFormValues {
  phoneNumber: string;
  password: string;
}

export interface LoginFormErrors {
  phoneNumber?: string;
  password?: string;
  general?: string;
}
