import ChevronButton from './ChevronButton'

interface HeaderProps {
  title: string
  onPrev?: () => void
  onNext?: () => void
  /** 높이·여백·배경 등 맥락별 스타일. 기본값을 두지 않아 pill 배경(통계)과
   * 여백만 있는 형태(홈) 양쪽 다 클래스 충돌 없이 그대로 먹는다. */
  className?: string
}

function Header({ title, onPrev, onNext, className = '' }: HeaderProps) {
  return (
    <header className={`flex w-full items-center justify-between ${className}`}>
      <ChevronButton
        direction="left"
        label="이전"
        onClick={onPrev}
        className={onPrev ? '' : 'invisible'}
      />
      <h1 className="text-md font-semibold text-neutral-900">{title}</h1>
      <ChevronButton
        direction="right"
        label="다음"
        onClick={onNext}
        className={onNext ? '' : 'invisible'}
      />
    </header>
  )
}

export default Header
