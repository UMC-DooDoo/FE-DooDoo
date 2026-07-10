import ChevronButton from "./ChevronButton";

interface HeaderProps {
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

function Header({ title, onPrev, onNext, className = "" }: HeaderProps) {
  return (
    <header
      className={`flex w-full items-center justify-center gap-4 ${className}`}
    >
      <ChevronButton
        direction="left"
        label="이전"
        onClick={onPrev}
        className={onPrev ? "" : "invisible"}
      />
      <h1 className="text-md font-semibold text-neutral-900">{title}</h1>
      <ChevronButton
        direction="right"
        label="다음"
        onClick={onNext}
        className={onNext ? "" : "invisible"}
      />
    </header>
  );
}

export default Header;
