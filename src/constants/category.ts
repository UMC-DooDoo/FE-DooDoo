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

// 프론트 색 키 <-> 서버 색 enum 매핑.
// 단순 대소문자 변환이 아님에 주의: apricot <-> ORANGE.
const ACCENT_TO_SERVER: Record<AccentColor, string> = {
  blue: "BLUE",
  green: "GREEN",
  apricot: "ORANGE",
  purple: "PURPLE",
  pink: "PINK",
  cyan: "CYAN",
  yellow: "YELLOW",
  red: "RED",
  neutral: "GRAY",
};

const SERVER_TO_ACCENT: Record<string, AccentColor> = Object.fromEntries(
  Object.entries(ACCENT_TO_SERVER).map(([accent, server]) => [
    server,
    accent as AccentColor,
  ]),
);

/** 프론트 색 키 -> 서버 enum. 예: 'apricot' -> 'ORANGE' */
export function toServerColor(accent: AccentColor): string {
  return ACCENT_TO_SERVER[accent] ?? "GRAY";
}

/** 서버 enum -> 프론트 색 키. 모르는 값은 neutral. 예: 'ORANGE' -> 'apricot' */
export function toAccentColor(server: string): AccentColor {
  return SERVER_TO_ACCENT[server?.toUpperCase()] ?? "neutral";
}
