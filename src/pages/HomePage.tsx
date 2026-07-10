import { useState } from "react";
import Toggle from "../components/common/Toggle";
import ListItem from "../components/common/ListItem";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import DateCell from "../components/common/DateCell";
import AddTaskModal from "../components/home/AddTaskModal";
import AddCategoryModal from "../components/home/AddCategoryModal";
import { ACCENT_BG, CATEGORIES, CATEGORY_COLOR } from "../constants/category";
import type { AccentColor } from "../constants/category";
import { PRIORITIES, PRIORITY_COLOR } from "../constants/priority";
import type { Priority } from "../constants/priority";
import type { Category, Todo } from "../types/todo";

// ---------- 날짜 유틸 ----------
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** 해당 월 캘린더 그리드 (일요일 시작, 앞뒤 다른 달 날짜 포함) */
function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = addDays(first, -first.getDay());
  const end = addDays(last, 6 - last.getDay());
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  return days;
}

function getWeekOf(date: Date) {
  const start = addDays(date, -date.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

// ---------- 할 일 데이터 (API 연동 전 더미) ----------
const INITIAL_CATEGORIES: Category[] = CATEGORIES.map((name) => ({
  name,
  color: CATEGORY_COLOR[name],
}));

const todayKey = (offset: number) => toKey(addDays(new Date(), offset));

const INITIAL_TODOS: Todo[] = [
  { id: 1, title: "알고리즘 문제 풀기", date: todayKey(0), category: "공부", priority: 1, done: false },
  { id: 2, title: "주간 보고서 작성", date: todayKey(0), category: "일", priority: 1, done: false },
  { id: 3, title: "30분 달리기", date: todayKey(0), category: "운동", priority: 2, done: true },
  { id: 4, title: "청소기 돌리기", date: todayKey(0), category: "집안일", priority: 3, done: false },
  { id: 5, title: "영어 단어 암기", date: todayKey(1), category: "공부", priority: 2, done: false },
  { id: 6, title: "PT 수업", date: todayKey(-1), category: "운동", priority: 1, done: true },
  { id: 7, title: "회의 자료 준비", date: todayKey(2), category: "일", priority: 4, done: false },
  { id: 8, title: "책 30쪽 읽기", date: todayKey(3), category: "공부", priority: 3, done: false },
];

// ---------- 페이지 ----------
function HomePage() {
  const today = new Date();
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [view, setView] = useState("월");
  const [grouping, setGrouping] = useState("우선순위");
  const [selected, setSelected] = useState(today);
  const [viewYM, setViewYM] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  // 모달
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryHint, setNewCategoryHint] = useState<string | null>(null);

  const categoryColor = (name: string): AccentColor =>
    categories.find((c) => c.name === name)?.color ?? "blue";

  const byDate = new Map<string, Todo[]>();
  for (const todo of todos) {
    const list = byDate.get(todo.date) ?? [];
    list.push(todo);
    byDate.set(todo.date, list);
  }

  function selectDay(date: Date) {
    setSelected(date);
    setViewYM({ year: date.getFullYear(), month: date.getMonth() });
  }

  function moveMonth(delta: number) {
    const next = new Date(viewYM.year, viewYM.month + delta, 1);
    setViewYM({ year: next.getFullYear(), month: next.getMonth() });
    const isThisMonth =
      next.getFullYear() === today.getFullYear() &&
      next.getMonth() === today.getMonth();
    setSelected(isThisMonth ? today : next);
  }

  function moveWeek(delta: number) {
    selectDay(addDays(selected, delta * 7));
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function addTodo(data: { title: string; category: string; priority: Priority }) {
    setTodos((prev) => [
      ...prev,
      {
        id: prev.reduce((max, t) => Math.max(max, t.id), 0) + 1,
        title: data.title,
        date: toKey(selected),
        category: data.category,
        priority: data.priority,
        done: false,
      },
    ]);
    setShowAddTask(false);
  }

  function addCategory(cat: Category) {
    setCategories((prev) => [...prev, cat]);
    setNewCategoryHint(cat.name);
    setShowAddCategory(false);
  }

  const days =
    view === "월" ? getMonthGrid(viewYM.year, viewYM.month) : getWeekOf(selected);

  const selectedTodos = byDate.get(toKey(selected)) ?? [];
  const doneCount = selectedTodos.filter((t) => t.done).length;

  // 그룹핑: 우선순위별 또는 분야별
  const groups =
    grouping === "우선순위"
      ? PRIORITIES.map((p) => ({
          key: String(p),
          label: `${p}순위`,
          dot: ACCENT_BG[PRIORITY_COLOR[p]] as string | undefined,
          items: selectedTodos.filter((t) => t.priority === p),
        })).filter((g) => g.items.length > 0)
      : [...new Set(selectedTodos.map((t) => t.category))].map((c) => ({
          key: c,
          label: c,
          dot: undefined as string | undefined,
          items: selectedTodos.filter((t) => t.category === c),
        }));

  const dateTitle = `${selected.getMonth() + 1}월 ${selected.getDate()}일 ${WEEKDAYS[selected.getDay()]}요일`;

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단: 타이틀 + 월/주 토글 + 월 이동 내비게이션. 통계 페이지와 동일한
       * px-5 pt-4 gap-4 컨테이너를 써서 탭 전환 시 PageTitle 위치가 흔들리지 않는다. */}
      <div className="flex flex-col gap-4 px-5 pt-4">
        <div className="flex items-end justify-between">
          <PageTitle eyebrow="MY TASKS" title="할 일" />
          <Toggle
            options={["월", "주"]}
            value={view}
            onChange={setView}
            icons={[
              <svg key="m" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 6.5H14M5.5 1.5V4M10.5 1.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>,
              <svg key="w" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 4.5H13M3 8H13M3 11.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>,
            ]}
          />
        </div>

        <Header
          title={`${viewYM.year}년 ${viewYM.month + 1}월`}
          onPrev={() => (view === "월" ? moveMonth(-1) : moveWeek(-1))}
          onNext={() => (view === "월" ? moveMonth(1) : moveWeek(1))}
          className="py-3"
        />
      </div>

      {/* 캘린더 */}
      <div className="px-5 pt-4 pb-3">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((w, i) => (
            <span
              key={w}
              className={`py-1 text-center text-xs ${
                i === 0
                  ? "text-danger"
                  : i === 6
                    ? "text-blue-500"
                    : "text-neutral-400"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((date) => {
            const key = toKey(date);
            const inMonth = date.getMonth() === viewYM.month;
            const isSelected = key === toKey(selected);
            const dayTodos = byDate.get(key) ?? [];
            const allDone = dayTodos.length > 0 && dayTodos.every((t) => t.done);
            const dots = [...new Set(dayTodos.map((t) => t.category))].slice(0, 3);

            const textClassName = !inMonth
              ? "text-neutral-200"
              : date.getDay() === 0
                ? "text-danger"
                : date.getDay() === 6
                  ? "text-blue-500"
                  : "text-neutral-900";

            return (
              <DateCell
                key={key}
                day={date.getDate()}
                selected={isSelected}
                textClassName={textClassName}
                dotColors={dots.map((c) => ACCENT_BG[categoryColor(c)])}
                dimDots={allDone}
                onClick={() => selectDay(date)}
              />
            );
          })}
        </div>
      </div>

      {/* 선택 날짜의 할 일 목록 */}
      <section className="flex flex-1 flex-col border-t border-neutral-100 px-5 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-neutral-400">{dateTitle}</p>
            <p className="text-lg font-bold">
              {selectedTodos.length}개의 할 일{" "}
              {selectedTodos.length > 0 && (
                <span className="text-xs font-medium text-blue-500">
                  {doneCount}/{selectedTodos.length} 완료
                </span>
              )}
            </p>
          </div>
          <Toggle
            options={["분야별", "우선순위"]}
            value={grouping}
            onChange={setGrouping}
          />
        </div>

        {selectedTodos.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-300">
            등록된 할 일이 없습니다.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2 pb-4">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  {group.dot && (
                    <span className={`h-2 w-2 rounded-full ${group.dot}`} />
                  )}
                  <span className="text-sm font-semibold text-neutral-600">
                    {group.label}
                  </span>
                  <span className="text-xs text-neutral-300">
                    {group.items.filter((t) => t.done).length}/
                    {group.items.length}
                  </span>
                </div>
                {group.items.map((todo) => (
                  <ListItem
                    key={todo.id}
                    label={todo.title}
                    checked={todo.done}
                    chipLabel={todo.category}
                    chipColor={categoryColor(todo.category)}
                    onToggle={() => toggleTodo(todo.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 할 일 추가 FAB */}
        <button
          type="button"
          aria-label="할 일 추가"
          onClick={() => setShowAddTask(true)}
          className="sticky bottom-20 z-10 mt-auto mb-4 flex h-12 w-12 items-center justify-center self-end rounded-lg bg-blue-500 text-white shadow-lg active:bg-blue-600"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </section>

      {/* 모달 */}
      <AddTaskModal
        open={showAddTask}
        categories={categories}
        selectHint={newCategoryHint}
        onClose={() => setShowAddTask(false)}
        onRequestAddCategory={() => setShowAddCategory(true)}
        onSubmit={addTodo}
      />
      <AddCategoryModal
        open={showAddCategory}
        existingNames={categories.map((c) => c.name)}
        onClose={() => setShowAddCategory(false)}
        onSubmit={addCategory}
      />
    </div>
  );
}

export default HomePage;
