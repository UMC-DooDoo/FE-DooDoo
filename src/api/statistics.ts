// 통계 API. 엔드포인트: /statistics/* (BE: 준열 권)

import { axiosInstance, unwrap } from "./axiosInstance";
import { toAccentColor } from "../constants/category";
import type { AccentColor } from "../constants/category";

const ym = (year: number, month: number) => ({ params: { year, month } });

// ---- 월별 요약 ----
export interface SummaryBanner {
  level: string;
  title: string;
  message: string;
}
export interface MonthlySummary {
  year: number;
  month: number;
  banner: SummaryBanner;
  completionRate: number;
  totalCount: number;
  completedCount: number;
  incompleteCount: number;
}

/** 월별 통계 — GET /statistics/summary?year=&month= */
export async function getMonthlySummary(year: number, month: number) {
  return unwrap<MonthlySummary>(
    axiosInstance.get("/statistics/summary", ym(year, month)),
  );
}

// ---- 일별 달성 현황 ----
export interface DailyStat {
  date: string;
  completedCount: number;
  incompleteCount: number;
}

/** 일별 달성 현황 — GET /statistics/daily?year=&month= */
export async function getDailyStats(year: number, month: number) {
  const res = await unwrap<{ dailyStatistics: DailyStat[] }>(
    axiosInstance.get("/statistics/daily", ym(year, month)),
  );
  return res.dailyStatistics;
}

// ---- 분야별 달성률 ----
export interface CategoryRate {
  categoryId: number;
  categoryName: string;
  color: AccentColor;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}
interface CategoryRateDto extends Omit<CategoryRate, "color"> {
  color: string;
}

/** 분야별 달성률 — GET /statistics/category?year=&month= */
export async function getCategoryRates(
  year: number,
  month: number,
): Promise<CategoryRate[]> {
  const res = await unwrap<{ categoryStatistics: CategoryRateDto[] }>(
    axiosInstance.get("/statistics/category", ym(year, month)),
  );
  return res.categoryStatistics.map((c) => ({
    ...c,
    color: toAccentColor(c.color),
  }));
}

// ---- 우선순위별 달성률 ----
export interface PriorityRate {
  priority: string; // FIRST | SECOND | THIRD | FOURTH
  priorityName: string; // "1순위" 등
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

/** 우선순위별 달성률 — GET /statistics/priority?year=&month= */
export async function getPriorityRates(year: number, month: number) {
  const res = await unwrap<{ priorityStatistics: PriorityRate[] }>(
    axiosInstance.get("/statistics/priority", ym(year, month)),
  );
  return res.priorityStatistics;
}
