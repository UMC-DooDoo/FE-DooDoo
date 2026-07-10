import { useState } from "react";
import Toggle from "../components/common/Toggle";
import ListItem from "../components/common/ListItem";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import DateCell from "../components/common/DateCell";
import AddTaskModal from "../components/home/AddTaskModal";
import AddCategoryModal from "../components/home/AddCategoryModal";
import { useHomeStore } from "../store/homeStore";
import { toKey, addDays } from "../utils/date";
import { ACCENT_BG } from "../constants/category";
import { PRIORITIES, PRIORITY_COLOR } from "../constants/priority";
import type { Category } from "../types/todo";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

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

function HomePage() {
  const {
    todos,
    categories,
    view,
    grouping,
    selected,
    viewYM,
    toggleTodo,
    addTodo,
    addCategory,
    selectDay,
    moveMonth,
    moveWeek,
    setView,
    setGrouping,
  } = useHomeStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryHint, setNewCategoryHint] = useState<string | null>(null);

  const categoryColor = (name: string) =>
    categories.find((c) => c.name === name)?.color ?? "blue";

  const byDate = new Map<string, typeof todos>();
  for (const todo of todos) {
    const list = byDate.get(todo.date) ?? [];
    list.push(todo);
    byDate.set(todo.date, list);
  }

  function handleAddTodo(data: Parameters<typeof addTodo>[0]) {
    addTodo(data);
    setShowAddTask(false);
  }

  function handleAddCategory(cat: Category) {
    addCategory(cat);
    setNewCategoryHint(cat.name);
    setShowAddCategory(false);
  }

  const days =
    view === "월"
      ? getMonthGrid(viewYM.year, viewYM.month)
      : getWeekOf(selected);

  const selectedTodos = byDate.get(toKey(selected)) ?? [];
  const doneCount = selectedTodos.filter((t) => t.done).length;

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
      <div className="flex flex-col gap-4 px-5 pt-4">
        <div className="flex items-end justify-between">
          <PageTitle eyebrow="MY TASKS" title="할 일" />
          <Toggle
            options={["월", "주"]}
            value={view}
            onChange={setView}
            icons={[
              <svg
                key="m"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 6.5H14M5.5 1.5V4M10.5 1.5V4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>,
              <svg
                key="w"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 4.5H13M3 8H13M3 11.5H13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
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
            const allDone =
              dayTodos.length > 0 && dayTodos.every((t) => t.done);
            const dots = [...new Set(dayTodos.map((t) => t.category))].slice(
              0,
              3,
            );

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

      <section className="flex flex-1 flex-col border-t border-neutral-100 px-5 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-neutral-400">{dateTitle}</p>
            <p className="text-lg font-bold">
              {selectedTodos.length}개의 할 일
              {selectedTodos.length > 0 && (
                <>
                  {" / "}
                  <span className="text-xs font-medium text-blue-500">
                    {doneCount}/{selectedTodos.length}개 완료
                  </span>
                </>
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

        <button
          type="button"
          aria-label="할 일 추가"
          onClick={() => setShowAddTask(true)}
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

      <AddTaskModal
        open={showAddTask}
        categories={categories}
        selectHint={newCategoryHint}
        onClose={() => setShowAddTask(false)}
        onRequestAddCategory={() => setShowAddCategory(true)}
        onSubmit={handleAddTodo}
      />
      <AddCategoryModal
        open={showAddCategory}
        existingNames={categories.map((c) => c.name)}
        onClose={() => setShowAddCategory(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
}

export default HomePage;
