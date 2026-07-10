import { create } from "zustand";
import { addDays, toKey } from "../utils/date";
import { CATEGORIES, CATEGORY_COLOR } from "../constants/category";
import type { Priority } from "../constants/priority";
import type { Category, Todo } from "../types/todo";

const INITIAL_CATEGORIES: Category[] = CATEGORIES.map((name) => ({
  name,
  color: CATEGORY_COLOR[name],
}));

const todayKey = (offset: number) => toKey(addDays(new Date(), offset));

const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    title: "알고리즘 문제 풀기",
    date: todayKey(0),
    category: "공부",
    priority: 1,
    done: false,
  },
  {
    id: 2,
    title: "주간 보고서 작성",
    date: todayKey(0),
    category: "일",
    priority: 1,
    done: false,
  },
  {
    id: 3,
    title: "30분 달리기",
    date: todayKey(0),
    category: "운동",
    priority: 2,
    done: true,
  },
  {
    id: 4,
    title: "청소기 돌리기",
    date: todayKey(0),
    category: "집안일",
    priority: 3,
    done: false,
  },
  {
    id: 5,
    title: "영어 단어 암기",
    date: todayKey(1),
    category: "공부",
    priority: 2,
    done: false,
  },
  {
    id: 6,
    title: "PT 수업",
    date: todayKey(-1),
    category: "운동",
    priority: 1,
    done: true,
  },
  {
    id: 7,
    title: "회의 자료 준비",
    date: todayKey(2),
    category: "일",
    priority: 4,
    done: false,
  },
  {
    id: 8,
    title: "책 30쪽 읽기",
    date: todayKey(3),
    category: "공부",
    priority: 3,
    done: false,
  },
];

const today = new Date();

interface HomeStore {
  todos: Todo[];
  categories: Category[];
  view: string;
  grouping: string;
  selected: Date;
  viewYM: { year: number; month: number };

  toggleTodo: (id: number) => void;
  addTodo: (data: {
    title: string;
    category: string;
    priority: Priority;
  }) => void;
  addCategory: (cat: Category) => void;
  selectDay: (date: Date) => void;
  moveMonth: (delta: number) => void;
  moveWeek: (delta: number) => void;
  setView: (view: string) => void;
  setGrouping: (grouping: string) => void;
}

export const useHomeStore = create<HomeStore>((set, get) => ({
  todos: INITIAL_TODOS,
  categories: INITIAL_CATEGORIES,
  view: "월",
  grouping: "우선순위",
  selected: today,
  viewYM: { year: today.getFullYear(), month: today.getMonth() },

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),

  addTodo: (data) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: state.todos.reduce((max, t) => Math.max(max, t.id), 0) + 1,
          title: data.title,
          date: toKey(state.selected),
          category: data.category,
          priority: data.priority,
          done: false,
        },
      ],
    })),

  addCategory: (cat) =>
    set((state) => ({ categories: [...state.categories, cat] })),

  selectDay: (date) =>
    set({
      selected: date,
      viewYM: { year: date.getFullYear(), month: date.getMonth() },
    }),

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
  },

  moveWeek: (delta) => {
    get().selectDay(addDays(get().selected, delta * 7));
  },

  setView: (view) => set({ view }),
  setGrouping: (grouping) => set({ grouping }),
}));
