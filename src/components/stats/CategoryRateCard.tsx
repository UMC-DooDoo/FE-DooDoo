import Card from '../common/Card'
import ProgressBar from '../common/ProgressBar'
import { ACCENT_BG, ACCENT_TEXT } from '../../constants/category'
import { completionRate } from '../../types/stats'
import type { CategoryStat } from '../../types/stats'

interface CategoryRateCardProps {
  stats: CategoryStat[]
}

function CategoryRateCard({ stats }: CategoryRateCardProps) {
  if (stats.length === 0) {
    return (
      <Card title="분야별 달성률">
        <p className="py-8 text-center text-sm text-neutral-300">
          이번 달에 등록된 분야별 목표가 없습니다.
        </p>
      </Card>
    )
  }

  return (
    <Card title="분야별 달성률">
      <ul className="flex flex-col gap-4">
        {stats.map((stat) => {
          const color = stat.color
          const rate = completionRate(stat)

          return (
            <li key={stat.category} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`size-2 shrink-0 rounded-full ${ACCENT_BG[color]}`} />
                <span className="flex-1 text-sm font-medium text-neutral-900">
                  {stat.category}
                </span>
                <span className="text-xs text-neutral-400">
                  {stat.completed}/{stat.total}
                </span>
                <span className={`text-sm font-bold ${ACCENT_TEXT[color]}`}>
                  {rate}%
                </span>
              </div>
              <ProgressBar value={rate} color={color} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export default CategoryRateCard
