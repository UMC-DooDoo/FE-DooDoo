interface DateCellProps {
  day: number
  weekday?: string
  selected?: boolean
  count?: number
  onClick?: () => void
}

function DateCell({ day, weekday, selected = false, count, onClick }: DateCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-10 flex-col items-center gap-1 py-1"
    >
      {weekday && <span className="text-xs text-neutral-400">{weekday}</span>}
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
          selected ? 'bg-blue-500 font-semibold text-white' : 'text-neutral-900'
        }`}
      >
        {day}
      </span>
      {count !== undefined && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  )
}

export default DateCell
