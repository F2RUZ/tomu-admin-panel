// src/types/analytics.types.ts

export interface MonthlyProfit {
  totalProfit: number;
  liveChatProfit: number;
  tariffProfit: number;
}

export interface AnalyticsData {
  data: Record<string, MonthlyProfit>;
  totalLiveChatAmount: number;
  totalTariffAmount: number;
  totalProfit: number;
}

export interface ChartDataPoint {
  month: string;
  monthShort: string;
  totalProfit: number;
  liveChatProfit: number;
  tariffProfit: number;
}

export type PeriodType = "weekly" | "monthly" | "yearly";
