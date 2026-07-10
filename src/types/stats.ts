import type { Category } from '../constants/category'
import type { Priority } from '../constants/priority'

export interface MonthlyStats {
  /** 해당 월의 전체 할 일 수 */
  total: number
  /** 그중 완료한 수 */
  completed: number
}

/** 하루치 집계 */
export interface DailyStat extends MonthlyStats {
  /** 1 ~ 31 */
  day: number
}

export interface CategoryStat extends MonthlyStats {
  category: Category
}

export interface PriorityStat extends MonthlyStats {
  priority: Priority
}

/** 완료율(%). total 이 0이면 0을 돌려준다. */
export function completionRate({ total, completed }: MonthlyStats): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
