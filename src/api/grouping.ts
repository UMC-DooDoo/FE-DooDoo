// 일별 할 일 그룹핑 API. /categories/todos/grouped-by-* (BE: minwldnjs)
// 홈의 "분야별 / 우선순위" 토글에 대응.

import { axiosInstance, unwrap } from "./axiosInstance";
import { toAccentColor, ACCENT_BG } from "../constants/category";
import type { AccentColor } from "../constants/category";
import { PRIORITY_COLOR } from "../constants/priority";
import type { Priority } from "../constants/priority";

export interface GroupItem {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  category: string;
  color: AccentColor;
}

export interface Group {
  key: string;
  label: string;
  dot: string; // 그룹 헤더 점 배경 클래스
  completed: number;
  total: number;
  items: GroupItem[];
}

// ---- 분야별 ----
interface CategoryGroupTodoDto {
  todoId: number;
  title: string;
  priority: Priority;
  isCompleted: boolean;
}
interface CategoryGroupDto {
  categoryId: number;
  categoryName: string;
  color: string;
  todos: CategoryGroupTodoDto[];
}

/** 분야별 그룹핑 — GET /categories/todos/grouped-by-category?date= */
export async function getGroupedByCategory(date: string): Promise<Group[]> {
  const res = await unwrap<{ date: string; groups: CategoryGroupDto[] }>(
    axiosInstance.get("/categories/todos/grouped-by-category", {
      params: { date },
    }),
  );
  return res.groups.map((g) => {
    const color = toAccentColor(g.color);
    return {
      key: `cat-${g.categoryId}`,
      label: g.categoryName,
      dot: ACCENT_BG[color],
      completed: g.todos.filter((t) => t.isCompleted).length,
      total: g.todos.length,
      items: g.todos.map((t) => ({
        id: t.todoId,
        title: t.title,
        done: t.isCompleted,
        priority: t.priority,
        category: g.categoryName,
        color,
      })),
    };
  });
}

// ---- 우선순위별 ----
interface PriorityGroupTodoDto {
  todoId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  color: string;
  isCompleted: boolean;
}
interface PriorityGroupDto {
  priority: Priority;
  todos: PriorityGroupTodoDto[];
}

/** 우선순위별 그룹핑 — GET /categories/todos/grouped-by-priority?date= */
export async function getGroupedByPriority(date: string): Promise<Group[]> {
  const res = await unwrap<{ date: string; groups: PriorityGroupDto[] }>(
    axiosInstance.get("/categories/todos/grouped-by-priority", {
      params: { date },
    }),
  );
  return res.groups.map((g) => ({
    key: `pri-${g.priority}`,
    label: `${g.priority}순위`,
    dot: ACCENT_BG[PRIORITY_COLOR[g.priority]],
    completed: g.todos.filter((t) => t.isCompleted).length,
    total: g.todos.length,
    items: g.todos.map((t) => ({
      id: t.todoId,
      title: t.title,
      done: t.isCompleted,
      priority: g.priority,
      category: t.categoryName,
      color: toAccentColor(t.color),
    })),
  }));
}
