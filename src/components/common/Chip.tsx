type ChipColor =
  | 'blue'
  | 'green'
  | 'pink'
  | 'yellow'
  | 'purple'
  | 'cyan'
  | 'apricot'

const chipColors: Record<ChipColor, string> = {
  blue: 'text-blue-500 bg-blue-50',
  green: 'text-green-500 bg-green-100',
  pink: 'text-pink-500 bg-pink-100',
  yellow: 'text-yellow-500 bg-yellow-100',
  purple: 'text-purple-500 bg-purple-100',
  cyan: 'text-cyan-500 bg-cyan-100',
  apricot: 'text-apricot-500 bg-apricot-100',
}

type ChipSize = 'medium' | 'small'

// 피그마: padding 4px 8px, radius 8px / medium 폰트 12(높이 20), small 폰트 10(높이 18)
const chipSizes: Record<ChipSize, string> = {
  medium: 'text-xs',
  small: 'text-[10px]',
}

interface ChipProps {
  label: string
  color?: ChipColor
  size?: ChipSize
}

function Chip({ label, color = 'blue', size = 'medium' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-2 py-1 leading-none font-medium ${chipSizes[size]} ${chipColors[color]}`}
    >
      {label}
    </span>
  )
}

export default Chip
export type { ChipColor, ChipSize }
