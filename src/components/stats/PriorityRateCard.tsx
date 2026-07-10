import Card from '../common/Card'
import ProgressBar from '../common/ProgressBar'
import { PRIORITY_COLOR, PRIORITY_TINT } from '../../constants/priority'
import { completionRate } from '../../types/stats'
import type { PriorityStat } from '../../types/stats'

interface PriorityRateCardProps {
  stats: PriorityStat[]
}

function PriorityRateCard({ stats }: PriorityRateCardProps) {
  return (
    <Card title="우선순위별 달성률">
      <ul className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const tint = PRIORITY_TINT[stat.priority]
          const rate = completionRate(stat)

          return (
            <li
              key={stat.priority}
              className={`flex flex-col gap-1 rounded-lg p-3 ${tint.bg}`}
            >
              <div className="flex items-baseline justify-between">
                <span className={`text-sm font-bold ${tint.text}`}>
                  {stat.priority}순위
                </span>
                <span className="text-xs text-neutral-400">
                  {stat.completed}/{stat.total}
                </span>
              </div>
              <span className={`text-xl font-bold ${tint.text}`}>{rate}%</span>
              <ProgressBar
                value={rate}
                color={PRIORITY_COLOR[stat.priority]}
                trackClassName="bg-white/60"
                className="mt-1"
              />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export default PriorityRateCard
