import { create } from "zustand";
import { addDays, toKey } from "../utils/date";
import {
  getMonthlyCalendar,
  getTodosByDate,
  createTodo,
  toggleComplete,
  deleteTodo as apiDeleteTodo,
} from "../api/todo";
import type { CalendarDay, TodoListItem } from "../api/todo";
import {
  getCategories,
  createCategory,
  deleteCategory as apiDeleteCategory,
} from "../api/category";
import type { CategoryItem } from "../api/category";
import type { Group } from "../api/grouping";
import { ApiError } from "../types/api";
import { ACCENT_BG } from "../constants/category";
import type { AccentColor } from "../constants/category";
import { PRIORITIES, PRIORITY_COLOR } from "../constants/priority";
import type { Priority } from "../constants/priority";

// 그룹핑 API(500 등) 실패 시 /todos 응답으로 화면에서 직접 그룹핑하는 폴백.
function fallbackGroups(
  todos: TodoListItem[],
  categories: CategoryItem[],
  grouping: string,
): Group[] {
  const catById = new Map(categories.map((c) => [c.id, c]));
  const toItem = (t: TodoListItem) => {
    const cat = catById.get(t.categoryId);
    return {
      id: t.id,
      title: t.title,
      done: t.done,
      priority: t.priority,
      category: cat?.name ?? "",
      color: (cat?.color ?? "neutral") as AccentColor,
    };
  };

  if (grouping === "우선순위") {
    return PRIORITIES.map((p) => {
      const items = todos.filter((t) => t.priority === p).map(toItem);
      return {
        key: `pri-${p}`,
        label: `${p}순위`,
        dot: ACCENT_BG[PRIORITY_COLOR[p]],
        completed: items.filter((i) => i.done).length,
        total: items.length,
        items,
      };
    }).filter((g) => g.total > 0);
  }

  // 분야별
  const ids = [...new Set(todos.map((t) => t.categoryId))];
  return ids.map((id) => {
    const cat = catById.get(id);
    const items = todos.filter((t) => t.categoryId === id).map(toItem);
    return {
      key: `cat-${id}`,
      label: cat?.name ?? `분야 ${id}`,
      dot: ACCENT_BG[cat?.color ?? "neutral"],
      completed: items.filter((i) => i.done).length,
      total: items.length,
      items,
    };
  });
}

const today = new Date();

function monthStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function messageOf(e: unknown) {
  return e instanceof ApiError ? e.message : "요청 중 오류가 발생했습니다.";
}

interface HomeStore {
  categories: CategoryItem[];
  calendarDays: CalendarDay[];
  groups: Group[];
  total: number;
  completed: number;
  view: string;
  grouping: string;
  selected: Date;
  viewYM: { year: number; month: number };
  loading: boolean;
  error: string | null;

  init: () => Promise<void>;
  reloadCalendar: () => Promise<void>;
  reloadGroups: () => Promise<void>;

  selectDay: (date: Date) => void;
  moveMonth: (delta: number) => void;
  moveWeek: (delta: number) => void;
  setView: (view: string) => void;
  setGrouping: (grouping: string) => void;

  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  addTodo: (data: {
    title: string;
    categoryId: number;
    priority: Priority;
  }) => Promise<void>;
  addCategory: (name: string, color: AccentColor) => Promise<CategoryItem>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useHomeStore = create<HomeStore>((set, get) => ({
  categories: [],
  calendarDays: [],
  groups: [],
  total: 0,
  completed: 0,
  view: "월",
  grouping: "우선순위",
  selected: today,
  viewYM: { year: today.getFullYear(), month: today.getMonth() },
  loading: false,
  error: null,

  init: async () => {
    set({ loading: true, error: null });
    // 분야 목록 실패(미배포/500)해도 캘린더·할일은 뜨게 개별 처리
    try {
      const categories = await getCategories();
      set({ categories });
    } catch {
      // 분야 API가 아직 없으면 빈 목록으로 진행
      set({ categories: [] });
    }
    await Promise.all([get().reloadCalendar(), get().reloadGroups()]);
    set({ loading: false });
  },

  reloadCalendar: async () => {
    const { viewYM } = get();
    try {
      const calendarDays = await getMonthlyCalendar(
        monthStr(viewYM.year, viewYM.month),
      );
      set({ calendarDays });
    } catch (e) {
      set({ error: messageOf(e) });
    }
  },

  reloadGroups: async () => {
    // 그룹핑 API(/categories/todos/grouped-by-*)가 아직 미배포라
    // 배포된 /todos 로 조회하고 화면에서 직접 그룹핑한다.
    // (그룹핑 API 배포되면 getGroupedBy* 로 교체)
    const { selected, grouping } = get();
    const date = toKey(selected);
    try {
      const { todos, totalCount, completedCount } = await getTodosByDate(date);
      const groups = fallbackGroups(todos, get().categories, grouping);
      set({ groups, total: totalCount, completed: completedCount, error: null });
    } catch (e) {
      set({ groups: [], total: 0, completed: 0, error: messageOf(e) });
    }
  },

  selectDay: (date) => {
    const monthChanged = date.getMonth() !== get().viewYM.month;
    set({
      selected: date,
      viewYM: { year: date.getFullYear(), month: date.getMonth() },
    });
    get().reloadGroups();
    if (monthChanged) get().reloadCalendar();
  },

  moveMonth: (delta) => {
    const { viewYM } = get();
    const next = new Date(viewYM.year, viewYM.month + delta, 1);
    const now = new Date();
    const isThisMonth =
      next.getFullYear() === now.getFullYear() &&
      next.getMonth() === now.getMonth();
    set({
      viewYM: { year: next.getFullYear(), month: next.getMonth() },
      selected: isThisMonth ? now : next,
    });
    get().reloadCalendar();
    get().reloadGroups();
  },

  moveWeek: (delta) => {
    get().selectDay(addDays(get().selected, delta * 7));
  },

  setView: (view) => set({ view }),

  setGrouping: (grouping) => {
    set({ grouping });
    get().reloadGroups();
  },

  toggleTodo: async (id) => {
    try {
      await toggleComplete(id);
      await Promise.all([get().reloadGroups(), get().reloadCalendar()]);
    } catch (e) {
      set({ error: messageOf(e) });
    }
  },

  deleteTodo: async (id) => {
    try {
      await apiDeleteTodo(id);
      await Promise.all([get().reloadGroups(), get().reloadCalendar()]);
    } catch (e) {
      set({ error: messageOf(e) });
    }
  },

  addTodo: async (data) => {
    try {
      await createTodo({
        categoryId: data.categoryId,
        title: data.title,
        taskDate: toKey(get().selected),
        priority: data.priority,
      });
      await Promise.all([get().reloadGroups(), get().reloadCalendar()]);
    } catch (e) {
      set({ error: messageOf(e) });
    }
  },

  addCategory: async (name, color) => {
    try {
      const created = await createCategory(name, color);
      set((state) => ({ categories: [...state.categories, created], error: null }));
      return created;
    } catch (e) {
      set({ error: messageOf(e) });
      throw e;
    }
  },

  deleteCategory: async (id) => {
    try {
      await apiDeleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      await get().reloadGroups();
    } catch (e) {
      set({ error: messageOf(e) });
    }
  },
}));
