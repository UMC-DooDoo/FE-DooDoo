interface DateCellProps {
  day: number
  selected?: boolean
  /** 선택되지 않았을 때 숫자에 적용할 색 (일/토 강조, 다른 달 흐림 등은 호출부에서 계산) */
  textClassName?: string
  /** 그날 표시할 점 색상(bg-* 클래스). 최대 3개까지만 그려진다 */
  dotColors?: string[]
  /** 해당 날짜의 할 일이 모두 완료됐을 때 점을 옅게 표시 */
  dimDots?: boolean
  onClick?: () => void
}

function DateCell({
  day,
  selected = false,
  textClassName = 'text-neutral-900',
  dotColors = [],
  dimDots = false,
  onClick,
}: DateCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 py-1"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
          selected ? 'bg-blue-500 font-semibold text-white' : textClassName
        }`}
      >
        {day}
      </span>
      <span className="flex h-1.5 items-center gap-0.5">
        {dotColors.slice(0, 3).map((color, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${color} ${dimDots ? 'opacity-30' : ''}`}
          />
        ))}
      </span>
    </button>
  )
}

export default DateCell
