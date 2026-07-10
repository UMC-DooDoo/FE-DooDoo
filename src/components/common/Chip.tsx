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

interface ChipProps {
  label: string
  color?: ChipColor
}

function Chip({ label, color = 'blue' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${chipColors[color]}`}
    >
      {label}
    </span>
  )
}

export default Chip
export type { ChipColor }
