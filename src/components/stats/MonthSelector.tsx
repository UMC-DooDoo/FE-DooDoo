interface MonthSelectorProps {
  year: number
  /** 1 ~ 12 */
  month: number
  onPrev: () => void
  onNext: () => void
}

function MonthSelector({ year, month, onPrev, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-neutral-100 px-2 py-3">
      <button type="button" aria-label="이전 달" onClick={onPrev} className="p-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="text-md font-semibold text-neutral-900">
        {year}년 {month}월
      </span>
      <button type="button" aria-label="다음 달" onClick={onNext} className="p-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default MonthSelector
