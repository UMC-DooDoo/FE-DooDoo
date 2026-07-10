interface Message {
  emoji: string;
  title: string;
  description: string;
}

function getMessage(rate: number): Message {
  if (rate >= 100)
    return {
      emoji: "🎉",
      title: "전부 달성!",
      description: "완벽한 한 달이었어요.",
    };
  if (rate >= 75)
    return {
      emoji: "🔥",
      title: "거의 다 왔어요!",
      description: "마무리까지 조금만 더 힘내봐요.",
    };
  if (rate >= 50)
    return {
      emoji: "💪",
      title: "절반 이상 달성!",
      description: "좋은 흐름이에요. 조금만 더 힘내봐요!",
    };
  if (rate >= 25)
    return {
      emoji: "🙂",
      title: "순조롭게 가고 있어요",
      description: "벌써 4분의 1 넘게 해냈어요.",
    };
  return {
    emoji: "🌱",
    title: "이제 시작이에요",
    description: "첫걸음을 뗐어요, 하나씩 채워봐요.",
  };
}

interface SummaryBannerProps {
  rate: number;
}

function SummaryBanner({ rate }: SummaryBannerProps) {
  const { emoji, title, description } = getMessage(rate);

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
  );
}

export default SummaryBanner;
