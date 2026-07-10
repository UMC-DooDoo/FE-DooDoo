import { useState } from 'react'
import Header from '../components/common/Header'
import PageTitle from '../components/common/PageTitle'
import SummaryBanner from '../components/stats/SummaryBanner'
import CompletionCard from '../components/stats/CompletionCard'
import DailyChartCard from '../components/stats/DailyChartCard'
import CategoryRateCard from '../components/stats/CategoryRateCard'
import PriorityRateCard from '../components/stats/PriorityRateCard'
import { completionRate } from '../types/stats'
import type {
  CategoryStat,
  DailyStat,
  MonthlyStats,
  PriorityStat,
} from '../types/stats'

// TODO: API 연동 시 react-query 로 교체
const MOCK_STATS: MonthlyStats = { total: 20, completed: 11 }

const MOCK_DAILY_PATTERN: Record<number, [total: number, completed: number]> = {
  3: [3, 2],
  5: [3, 3],
  8: [2, 1],
  10: [4, 3],
  14: [2, 1],
  16: [2, 1],
  18: [2, 1],
  24: [2, 0],
}

/** 그 달의 일수만큼 채운다. `new Date(y, m, 0)` 은 m월의 마지막 날이다. */
function buildMockDaily(year: number, month: number): DailyStat[] {
  const daysInMonth = new Date(year, month, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const [total, completed] = MOCK_DAILY_PATTERN[day] ?? [0, 0]
    return { day, total, completed }
  })
}

const MOCK_CATEGORY: CategoryStat[] = [
  { category: '공부', total: 5, completed: 2 },
  { category: '운동', total: 4, completed: 3 },
  { category: '일', total: 4, completed: 2 },
  { category: '집안일', total: 4, completed: 2 },
  { category: '일정', total: 3, completed: 2 },
]

const MOCK_PRIORITY: PriorityStat[] = [
  { priority: 1, total: 7, completed: 3 },
  { priority: 2, total: 7, completed: 4 },
  { priority: 3, total: 5, completed: 3 },
  { priority: 4, total: 1, completed: 1 },
]

function StatsPage() {
  const [{ year, month }, setMonth] = useState({ year: 2026, month: 6 })

  const moveMonth = (delta: number) => {
    setMonth((prev) => {
      // Date 로 넘기면 12월 → 1월 이월을 알아서 처리해준다
      const d = new Date(prev.year, prev.month - 1 + delta)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    })
  }

  const rate = completionRate(MOCK_STATS)

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

      <CompletionCard stats={MOCK_STATS} />

      <DailyChartCard days={buildMockDaily(year, month)} />

      <CategoryRateCard stats={MOCK_CATEGORY} />

      <PriorityRateCard stats={MOCK_PRIORITY} />
    </div>
  )
}

export default StatsPage
