import { useState } from "react";
import Toggle from "../components/common/Toggle";
import ListItem from "../components/common/ListItem";
import Header from "../components/common/Header";
import DateCell from "../components/common/DateCell";
import { ACCENT_BG, CATEGORY_COLOR } from "../constants/category";
import type { Category } from "../constants/category";
import { PRIORITIES, PRIORITY_COLOR } from "../constants/priority";
import type { Priority } from "../constants/priority";

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
interface Todo {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  priority: Priority;
  done: boolean;
}

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
  const [view, setView] = useState("월");
  const [grouping, setGrouping] = useState("우선순위");
  const [selected, setSelected] = useState(today);
  const [viewYM, setViewYM] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

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
    // 이동한 달이 이번 달이면 오늘, 아니면 1일 선택
    const isThisMonth =
      next.getFullYear() === today.getFullYear() &&
      next.getMonth() === today.getMonth();
    setSelected(isThisMonth ? today : next);
  }

  function moveWeek(delta: number) {
    const next = addDays(selected, delta * 7);
    selectDay(next);
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
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
      {/* 상단: 타이틀 + 월/주 토글 */}
      <div className="flex items-end justify-between px-4 pt-5 pb-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] text-neutral-400">
            MY TASKS
          </p>
          <h1 className="text-xl font-bold">할 일</h1>
        </div>
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

      {/* 월 이동 내비게이션 */}
      <Header
        title={`${viewYM.year}년 ${String(viewYM.month + 1).padStart(2, "0")}월`}
        onPrev={() => (view === "월" ? moveMonth(-1) : moveWeek(-1))}
        onNext={() => (view === "월" ? moveMonth(1) : moveWeek(1))}
        className="py-2"
      />

      {/* 캘린더 */}
      <div className="px-4 pb-3">
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
            const dots = [...new Set(dayTodos.map((t) => t.priority))]
              .sort()
              .slice(0, 3); // 동그라미는 최대 3개

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
                dotColors={dots.map((p) => ACCENT_BG[PRIORITY_COLOR[p]])}
                dimDots={allDone}
                onClick={() => selectDay(date)}
              />
            );
          })}
        </div>
      </div>

      {/* 선택 날짜의 할 일 목록 */}
      <section className="flex flex-1 flex-col border-t border-neutral-100 px-4 pt-4">
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
                    chipColor={CATEGORY_COLOR[todo.category]}
                    onToggle={() => toggleTodo(todo.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 할 일 추가 버튼 — TODO: 등록 화면/모달 연결 */}
        <button
          type="button"
          aria-label="할 일 추가"
          className="sticky bottom-20 z-10 mt-auto mb-4 flex h-12 w-12 items-center justify-center self-end rounded-lg bg-blue-500 text-white shadow-lg active:bg-blue-600"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </section>
    </div>
  );
}

export default HomePage;
