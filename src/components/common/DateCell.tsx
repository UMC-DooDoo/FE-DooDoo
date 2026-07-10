interface DateCellProps {
  day: number;
  selected?: boolean;
  textClassName?: string;
  dotColors?: string[];
  dimDots?: boolean;
  onClick?: () => void;
}

function DateCell({
  day,
  selected = false,
  textClassName = "text-neutral-900",
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
          selected ? "bg-blue-500 font-semibold text-white" : textClassName
        }`}
      >
        {day}
      </span>
      <span className="flex h-1.5 items-center gap-0.5">
        {dotColors.slice(0, 3).map((color, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${color} ${dimDots ? "opacity-30" : ""}`}
          />
        ))}
      </span>
    </button>
  );
}

export default DateCell;
