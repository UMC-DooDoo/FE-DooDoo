import Card from '../common/Card'
import type { DailyStat } from '../../types/stats'

/** x축에 숫자를 노출할 날짜 */
const AXIS_DAYS = [1, 6, 11, 16, 21, 26]

interface DailyChartCardProps {
  days: DailyStat[]
}

function DailyChartCard({ days }: DailyChartCardProps) {
  // 가장 할 일이 많은 날을 100% 높이로 잡는다. 전부 0이면 1로 둬서 0 나누기를 막는다.
  const maxTotal = Math.max(1, ...days.map((d) => d.total))

  return (
    <Card title="일별 달성 현황">
      <ul className="border-border flex h-24 items-end gap-px border-y py-2">
        {days.map(({ day, total, completed }) => (
          <li key={day} className="flex h-full flex-1 items-end justify-center">
            {total > 0 && (
              <div
                className="flex w-1.5 flex-col justify-end overflow-hidden rounded-sm bg-neutral-100"
                style={{ height: `${(total / maxTotal) * 100}%` }}
              >
                <div
                  className="bg-primary w-full"
                  style={{ height: `${(completed / total) * 100}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <ul className="mt-1 flex gap-px">
        {days.map(({ day }) => (
          <li
            key={day}
            className="flex-1 text-center text-[10px] text-neutral-400"
          >
            {AXIS_DAYS.includes(day) ? day : ''}
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex gap-4">
        <li className="flex items-center gap-2">
          <span className="bg-primary size-2 rounded-full" />
          <span className="text-xs text-neutral-500">완료</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-neutral-100" />
          <span className="text-xs text-neutral-500">미완료</span>
        </li>
      </ul>
    </Card>
  )
}

export default DailyChartCard
