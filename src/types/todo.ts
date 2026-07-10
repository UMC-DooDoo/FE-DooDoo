import type { ChipColor } from "../components/common/Chip";

export type Priority = 1 | 2 | 3 | 4;

export interface Category {
  name: string;
  color: ChipColor;
}

export interface Todo {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: string; // 분야 이름
  priority: Priority;
  done: boolean;
}

// 우선순위 색: 1순위 빨강, 2순위 주황, 3순위 파랑, 4순위 회색
export const PRIORITY_META: Record<Priority, { label: string; dot: string }> = {
  1: { label: "1순위", dot: "bg-danger" },
  2: { label: "2순위", dot: "bg-apricot-300" },
  3: { label: "3순위", dot: "bg-blue-500" },
  4: { label: "4순위", dot: "bg-neutral-300" },
};

// 분야 추가에서 고를 수 있는 색 팔레트
export const CATEGORY_PALETTE: ChipColor[] = [
  "blue",
  "green",
  "apricot",
  "purple",
  "pink",
  "cyan",
  "yellow",
  "red",
];

// 팔레트 원형 스와치용 배경 클래스
export const CHIP_SWATCH: Record<ChipColor, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  apricot: "bg-apricot-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};
