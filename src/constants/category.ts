export const CATEGORIES = ["공부", "운동", "일", "집안일", "일정"] as const;

export type Category = (typeof CATEGORIES)[number];

export type AccentColor =
  | "blue"
  | "green"
  | "apricot"
  | "purple"
  | "pink"
  | "cyan"
  | "yellow"
  | "red"
  | "neutral";

export const ACCENT_COLORS: AccentColor[] = [
  "blue",
  "green",
  "apricot",
  "purple",
  "pink",
  "cyan",
  "yellow",
  "red",
];

export const CATEGORY_COLOR: Record<Category, AccentColor> = {
  공부: "blue",
  운동: "green",
  일: "apricot",
  집안일: "purple",
  일정: "red",
};

export const ACCENT_BG: Record<AccentColor, string> = {
  blue: "bg-blue-400",
  green: "bg-green-500",
  apricot: "bg-apricot-300",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  neutral: "bg-neutral-500",
};

export const ACCENT_TEXT: Record<AccentColor, string> = {
  blue: "text-blue-400",
  green: "text-green-500",
  apricot: "text-apricot-300",
  purple: "text-purple-500",
  pink: "text-pink-500",
  cyan: "text-cyan-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
  neutral: "text-neutral-500",
};

export function toServerColor(accent: AccentColor): string {
  return accent.toUpperCase();
}

export function toAccentColor(server: string): AccentColor {
  const lower = server?.toLowerCase();
  return (ACCENT_COLORS as string[]).includes(lower)
    ? (lower as AccentColor)
    : "neutral";
}
