interface Message {
  emoji: string
  title: string
  description: string
}

/** 완료율 구간별 응원 문구 */
function getMessage(rate: number): Message {
  if (rate >= 100)
    return {
      emoji: '🎉',
      title: '전부 달성!',
      description: '완벽한 한 달이었어요.',
    }
  if (rate >= 50)
    return {
      emoji: '💪',
      title: '절반 이상 달성!',
      description: '좋은 흐름이에요. 조금만 더 힘내봐요!',
    }
  if (rate > 0)
    return {
      emoji: '🌱',
      title: '시작이 반이에요',
      description: '차근차근 하나씩 채워봐요.',
    }
  return {
    emoji: '✨',
    title: '아직 시작 전이에요',
    description: '첫 할 일을 완료해볼까요?',
  }
}

interface SummaryBannerProps {
  /** 0 ~ 100 */
  rate: number
}

function SummaryBanner({ rate }: SummaryBannerProps) {
  const { emoji, title, description } = getMessage(rate)

  return (
    <div className="bg-primary flex items-center gap-4 rounded-lg p-4 text-white">
      <div
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/20 text-2xl"
      >
        {emoji}
      </div>
      <div>
        <p className="text-md font-bold">{title}</p>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
  )
}

export default SummaryBanner
