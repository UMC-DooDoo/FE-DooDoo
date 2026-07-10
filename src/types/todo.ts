import type { AccentColor } from "../constants/category";
import type { Priority } from "../constants/priority";

export type { Priority };

/** 사용자가 만든 분야. 이름과 색은 자유롭게 정한다 (5개 기본 분야로 고정되지 않음) */
export interface Category {
  name: string;
  color: AccentColor;
}

export interface Todo {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: string; // 분야 이름
  priority: Priority;
  done: boolean;
}
