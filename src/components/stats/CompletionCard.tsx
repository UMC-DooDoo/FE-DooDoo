import Card from '../common/Card'
import type { MonthlyStats } from '../../types/stats'
import { completionRate } from '../../types/stats'

const RADIUS = 50
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface DonutProps {
  rate: number
}

function Donut({ rate }: DonutProps) {
  return (
    <div className="relative shrink-0">
      <svg
        viewBox="0 0 120 120"
        className="size-32"
        role="img"
        aria-label={`완료율 ${rate}%`}
      >
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="18"
          className="stroke-neutral-100"
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${(CIRCUMFERENCE * rate) / 100} ${CIRCUMFERENCE}`}
          transform="rotate(-90 60 60)"
          className="stroke-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-neutral-900">{rate}%</span>
        <span className="text-xs text-neutral-500">완료율</span>
      </div>
    </div>
  )
}

interface LegendRowProps {
  dotClassName: string
  label: string
  value: number
  valueClassName?: string
}

function LegendRow({
  dotClassName,
  label,
  value,
  valueClassName = 'text-neutral-900',
}: LegendRowProps) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-2 shrink-0 rounded-full ${dotClassName}`} />
      <span className="flex-1 text-sm text-neutral-500">{label}</span>
      <span className={`text-md font-bold ${valueClassName}`}>{value}개</span>
    </li>
  )
}

interface CompletionCardProps {
  stats: MonthlyStats
}

function CompletionCard({ stats }: CompletionCardProps) {
  const rate = completionRate(stats)
  const incomplete = stats.total - stats.completed

  return (
    <Card>
      <div className="flex items-center gap-6">
        <Donut rate={rate} />
        <ul className="flex flex-1 flex-col gap-4">
          <LegendRow
            dotClassName="bg-neutral-300"
            label="전체"
            value={stats.total}
          />
          <LegendRow
            dotClassName="bg-primary"
            label="완료"
            value={stats.completed}
            valueClassName="text-primary"
          />
          <LegendRow
            dotClassName="bg-neutral-200"
            label="미완료"
            value={incomplete}
          />
        </ul>
      </div>
    </Card>
  )
}

export default CompletionCard
