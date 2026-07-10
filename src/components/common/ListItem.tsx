import Chip from './Chip'
import type { ChipColor } from './Chip'

interface ListItemProps {
  label: string
  checked?: boolean
  chipLabel?: string
  chipColor?: ChipColor
  onToggle?: () => void
}

function ListItem({
  label,
  checked = false,
  chipLabel,
  chipColor,
  onToggle,
}: ListItemProps) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-full border border-neutral-100 bg-white px-4 py-2.5 ${
        checked ? 'opacity-40' : ''
      }`}
    >
      <button
        type="button"
        aria-label={checked ? '완료 해제' : '완료'}
        onClick={onToggle}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-blue-500 bg-blue-500' : 'border-neutral-200 bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5L4.5 9L10 3.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-left text-sm ${
          checked ? 'text-neutral-400 line-through' : 'text-neutral-900'
        }`}
      >
        {label}
      </span>
      {chipLabel && <Chip label={chipLabel} color={chipColor} />}
    </div>
  )
}

export default ListItem
