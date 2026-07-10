import type { AccentColor } from "../../constants/category";

const chipColors: Record<AccentColor, string> = {
  blue: "text-blue-500 bg-blue-50",
  green: "text-green-500 bg-green-100",
  apricot: "text-apricot-500 bg-apricot-100",
  purple: "text-purple-500 bg-purple-100",
  pink: "text-pink-500 bg-pink-100",
  cyan: "text-cyan-500 bg-cyan-100",
  yellow: "text-yellow-500 bg-yellow-100",
  red: "text-red-500 bg-red-100",
  neutral: "text-neutral-500 bg-neutral-100",
};

type ChipSize = "medium" | "small";

const chipSizes: Record<ChipSize, string> = {
  medium: "text-xs",
  small: "text-[10px]",
};

interface ChipProps {
  label: string;
  color?: AccentColor;
  size?: ChipSize;
  selected?: boolean;
}

function Chip({
  label,
  color = "blue",
  size = "medium",
  selected = false,
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm px-2 py-1 leading-none font-medium ${chipSizes[size]} ${chipColors[color]} ${
        selected ? "outline-2 outline-blue-500" : ""
      }`}
    >
      {label}
    </span>
  );
}

export default Chip;
export type { ChipSize };
