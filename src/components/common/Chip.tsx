import type { AccentColor } from '../../constants/category'

// 점·진행바(ACCENT_BG/ACCENT_TEXT)와 같은 AccentColor 를 쓴다.
// 칩은 색 대비 배경이 필요해서 톤만 다르게(연한 배경 + 진한 글자) 별도로 둔다.
const chipColors: Record<AccentColor, string> = {
  blue: 'text-blue-500 bg-blue-50',
  green: 'text-green-500 bg-green-100',
  apricot: 'text-apricot-500 bg-apricot-100',
  purple: 'text-purple-500 bg-purple-100',
  red: 'text-red-500 bg-red-100',
  neutral: 'text-neutral-500 bg-neutral-100',
}

type ChipSize = 'medium' | 'small'

// 피그마: padding 4px 8px, radius 8px / medium 폰트 12(높이 20), small 폰트 10(높이 18)
const chipSizes: Record<ChipSize, string> = {
  medium: 'text-xs',
  small: 'text-[10px]',
}

interface ChipProps {
  label: string
  color?: AccentColor
  size?: ChipSize
}

function Chip({ label, color = 'blue', size = 'medium' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm px-2 py-1 leading-none font-medium ${chipSizes[size]} ${chipColors[color]}`}
    >
      {label}
    </span>
  )
}

export default Chip
export type { ChipSize }
