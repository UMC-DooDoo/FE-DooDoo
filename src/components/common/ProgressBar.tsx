import { ACCENT_BG } from '../../constants/category'
import type { AccentColor } from '../../constants/category'

interface ProgressBarProps {
  /** 0 ~ 100 */
  value: number
  color?: AccentColor
  /** 트랙(빈 부분) 배경. 카드 위에 얹을 땐 밝은 색이 필요하다. */
  trackClassName?: string
  className?: string
}

function ProgressBar({
  value,
  color = 'blue',
  trackClassName = 'bg-neutral-100',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] ${ACCENT_BG[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default ProgressBar
