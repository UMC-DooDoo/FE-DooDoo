// 할 일 API. 엔드포인트: /todos, /calendar (BE: 정연욱)

import { axiosInstance, unwrap } from "./axiosInstance";
import type { Priority } from "../constants/priority";

// 사용자는 Authorization(JWT) 헤더로 판별한다. userId 쿼리 없음.

// ---- 날짜별 목록 조회 ----
interface TodoListItemDto {
  todoId: number;
  title: string;
  categoryId: number;
  priority: Priority;
  isCompleted: boolean;
}

interface TodoListDto {
  date: string;
  totalCount: number;
  completedCount: number;
  todos: TodoListItemDto[];
}

export interface TodoListItem {
  id: number;
  title: string;
  categoryId: number;
  priority: Priority;
  done: boolean;
}

export interface TodoList {
  date: string;
  totalCount: number;
  completedCount: number;
  todos: TodoListItem[];
}

/** 날짜별 할 일 목록 — GET /todos?date=YYYY-MM-DD (인증 헤더로 사용자 판별) */
export async function getTodosByDate(date: string): Promise<TodoList> {
  const res = await unwrap<TodoListDto>(
    axiosInstance.get("/todos", { params: { date } }),
  );
  return {
    date: res.date,
    totalCount: res.totalCount,
    completedCount: res.completedCount,
    todos: res.todos.map((t) => ({
      id: t.todoId,
      title: t.title,
      categoryId: t.categoryId,
      priority: t.priority,
      done: t.isCompleted,
    })),
  };
}

/** 할 일 등록 — POST /todos */
export async function createTodo(body: {
  categoryId: number;
  title: string;
  taskDate: string; // YYYY-MM-DD
  priority: Priority;
}) {
  return unwrap<unknown>(axiosInstance.post("/todos", body));
}

/** 할 일 수정 — PATCH /todos/{todoId} */
export async function updateTodo(
  todoId: number,
  patch: Partial<{
    title: string;
    taskDate: string;
    categoryId: number;
    priority: Priority;
  }>,
) {
  return unwrap<unknown>(axiosInstance.patch(`/todos/${todoId}`, patch));
}

/** 완료 토글 — PATCH /todos/{todoId}/complete → { todoId, isCompleted } */
export async function toggleComplete(todoId: number) {
  return unwrap<{ todoId: number; isCompleted: boolean }>(
    axiosInstance.patch(`/todos/${todoId}/complete`),
  );
}

/** 할 일 삭제 — DELETE /todos/{todoId} */
export async function deleteTodo(todoId: number) {
  return unwrap<null>(axiosInstance.delete(`/todos/${todoId}`));
}

// ---- 월별 캘린더 요약 ----
export interface CalendarDay {
  date: string;
  priorities: Priority[];
  allCompleted: boolean;
}

interface CalendarDto {
  month: string;
  days: CalendarDay[];
}

/** 월별 캘린더 요약 — GET /calendar?month=YYYY-MM (인증 헤더로 사용자 판별) */
export async function getMonthlyCalendar(month: string): Promise<CalendarDay[]> {
  const res = await unwrap<CalendarDto>(
    axiosInstance.get("/calendar", { params: { month } }),
  );
  return res.days;
}
