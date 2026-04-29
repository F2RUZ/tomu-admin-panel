// src/types/tariff.types.ts

export interface Tariff {
  id: number;
  name: string;
  duration: number;
  price: number;
  options?: string[];
  courseId: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateTariffDto {
  name: string;
  duration: number;
  price: number;
  options?: string[];
  courseId: number;
}

export interface UpdateTariffDto {
  name?: string;
  duration?: number;
  price?: number;
  options?: string[];
  courseId?: number;
}

export interface TariffApiResponse {
  statusCode: number;
  message: string;
  data: Tariff;
}

export interface TariffListApiResponse {
  statusCode: number;
  message: string;
  data: Tariff[];
}
