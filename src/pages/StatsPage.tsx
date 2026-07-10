import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import SummaryBanner from "../components/stats/SummaryBanner";
import CompletionCard from "../components/stats/CompletionCard";
import DailyChartCard from "../components/stats/DailyChartCard";
import CategoryRateCard from "../components/stats/CategoryRateCard";
import PriorityRateCard from "../components/stats/PriorityRateCard";
import {
  getMonthlySummary,
  getDailyStats,
  getCategoryRates,
  getPriorityRates,
} from "../api/statistics";
import type { Priority } from "../constants/priority";
import type {
  CategoryStat,
  DailyStat,
  MonthlyStats,
  PriorityStat,
} from "../types/stats";

// 서버 우선순위 enum -> 1~4
const PRIORITY_NUM: Record<string, Priority> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
};

function StatsPage() {
  const now = new Date();
  const [{ year, month }, setMonth] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const moveMonth = (delta: number) => {
    setMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1 + delta);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  };

  const summaryQ = useQuery({
    queryKey: ["stats", "summary", year, month],
    queryFn: () => getMonthlySummary(year, month),
  });
  const dailyQ = useQuery({
    queryKey: ["stats", "daily", year, month],
    queryFn: () => getDailyStats(year, month),
  });
  const categoryQ = useQuery({
    queryKey: ["stats", "category", year, month],
    queryFn: () => getCategoryRates(year, month),
  });
  const priorityQ = useQuery({
    queryKey: ["stats", "priority", year, month],
    queryFn: () => getPriorityRates(year, month),
  });

  const stats: MonthlyStats = {
    total: summaryQ.data?.totalCount ?? 0,
    completed: summaryQ.data?.completedCount ?? 0,
  };
  const rate = summaryQ.data?.completionRate ?? 0;

  const daily: DailyStat[] = (dailyQ.data ?? []).map((d) => ({
    day: Number(d.date.split("-")[2]),
    total: d.completedCount + d.incompleteCount,
    completed: d.completedCount,
  }));

  const category: CategoryStat[] = (categoryQ.data ?? []).map((c) => ({
    category: c.categoryName,
    color: c.color,
    total: c.totalCount,
    completed: c.completedCount,
  }));

  const priority: PriorityStat[] = (priorityQ.data ?? []).map((p) => ({
    priority: PRIORITY_NUM[p.priority] ?? 1,
    total: p.totalCount,
    completed: p.completedCount,
  }));

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-6">
      <PageTitle eyebrow="STATISTICS" title="월별 통계" />

      <Header
        title={`${year}년 ${month}월`}
        onPrev={() => moveMonth(-1)}
        onNext={() => moveMonth(1)}
        className="py-3"
      />

      <SummaryBanner rate={rate} />
      <CompletionCard stats={stats} />
      <DailyChartCard days={daily} />
      <CategoryRateCard stats={category} />
      <PriorityRateCard stats={priority} />
    </div>
  );
}

export default StatsPage;
