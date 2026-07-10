import type { AccentColor } from "./category";

export const PRIORITIES = [1, 2, 3, 4] as const;

export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_COLOR: Record<Priority, AccentColor> = {
  1: "red",
  2: "apricot",
  3: "blue",
  4: "neutral",
};

export const PRIORITY_TINT: Record<Priority, { bg: string; text: string }> = {
  1: { bg: "bg-red-100", text: "text-red-500" },
  2: { bg: "bg-apricot-100", text: "text-apricot-300" },
  3: { bg: "bg-blue-50", text: "text-blue-400" },
  4: { bg: "bg-neutral-100", text: "text-neutral-500" },
};
