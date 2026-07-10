import { create } from "zustand";
import { addDays, toKey } from "../utils/date";
import {
  getMonthlyCalendar,
  createTodo,
  toggleComplete,
  deleteTodo as apiDeleteTodo,
} from "../api/todo";
import type { CalendarDay } from "../api/todo";
import {
  getCategories,
  createCategory,
  deleteCategory as apiDeleteCategory,
} from "../api/category";
import type { CategoryItem } from "../api/category";
import { getGroupedByCategory, getGroupedByPriority } from "../api/grouping";
import type { Group } from "../api/grouping";
import { ApiError } from "../types/api";
import type { AccentColor } from "../constants/category";
import type { Priority } from "../constants/priority";

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
    try {
      const categories = await getCategories();
      set({ categories });
      await Promise.all([get().reloadCalendar(), get().reloadGroups()]);
    } catch (e) {
      set({ error: messageOf(e) });
    } finally {
      set({ loading: false });
    }
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
    const { selected, grouping } = get();
    const date = toKey(selected);
    try {
      const groups =
        grouping === "우선순위"
          ? await getGroupedByPriority(date)
          : await getGroupedByCategory(date);
      const total = groups.reduce((s, g) => s + g.total, 0);
      const completed = groups.reduce((s, g) => s + g.completed, 0);
      set({ groups, total, completed });
    } catch (e) {
      set({ error: messageOf(e) });
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
    const created = await createCategory(name, color);
    set((state) => ({ categories: [...state.categories, created] }));
    return created;
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
