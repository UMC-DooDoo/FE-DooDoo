interface HeaderProps {
  title: string
  onPrev?: () => void
  onNext?: () => void
}

function Header({ title, onPrev, onNext }: HeaderProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between px-4">
      <button
        type="button"
        aria-label="이전"
        onClick={onPrev}
        className={`p-2 ${onPrev ? '' : 'invisible'}`}
      >
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
      <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
      <button
        type="button"
        aria-label="다음"
        onClick={onNext}
        className={`p-2 ${onNext ? '' : 'invisible'}`}
      >
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
    </header>
  )
}

export default Header
