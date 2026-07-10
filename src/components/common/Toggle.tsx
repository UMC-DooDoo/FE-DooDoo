import type { ReactNode } from "react";

interface ToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  /** 옵션 왼쪽에 붙는 아이콘 (선택) */
  icons?: [ReactNode, ReactNode];
}

function Toggle({ options, value, onChange, icons }: ToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-neutral-50 p-0.5">
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs transition-colors ${
            value === option
              ? "border border-border bg-white font-semibold text-text shadow-sm"
              : "border border-transparent text-neutral-300"
          }`}
        >
          {icons?.[i]}
          {option}
        </button>
      ))}
    </div>
  );
}

export default Toggle;
