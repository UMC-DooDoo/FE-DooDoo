import { useEffect, useState } from "react";
import Toggle from "../components/common/Toggle";
import ListItem from "../components/common/ListItem";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import DateCell from "../components/common/DateCell";
import AddTaskModal from "../components/home/AddTaskModal";
import AddCategoryModal from "../components/home/AddCategoryModal";
import { useHomeStore } from "../store/homeStore";
import { confirmModal } from "../store/confirmModalStore";
import { toKey, addDays } from "../utils/date";
import { ACCENT_BG } from "../constants/category";
import { PRIORITY_COLOR } from "../constants/priority";
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
    categories,
    calendarDays,
    groups,
    total,
    completed,
    view,
    grouping,
    selected,
    viewYM,
    error,
    init,
    toggleTodo,
    deleteTodo,
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

  // 최초 진입 시 데이터 로드
  useEffect(() => {
    init();
  }, [init]);

  // 날짜별 점 표시용 맵 (우선순위 색)
  const calendarMap = new Map(calendarDays.map((d) => [d.date, d]));

  function handleAddTodo(data: {
    title: string;
    category: string;
    priority: Parameters<typeof addTodo>[0]["priority"];
  }) {
    const categoryId = categories.find((c) => c.name === data.category)?.id;
    if (categoryId === undefined) return;
    addTodo({ title: data.title, categoryId, priority: data.priority });
    setShowAddTask(false);
  }

  function handleAddCategory(cat: Category) {
    // 서버에 생성하고 방금 만든 분야를 모달에서 자동 선택
    addCategory(cat.name, cat.color);
    setNewCategoryHint(cat.name);
    setShowAddCategory(false);
  }

  async function handleDeleteTodo(id: number) {
    const ok = await confirmModal({
      title: "할 일을 삭제할까요?",
      description: "삭제하면 되돌릴 수 없습니다.",
    });
    if (ok) deleteTodo(id);
  }

  const days =
    view === "월" ? getMonthGrid(viewYM.year, viewYM.month) : getWeekOf(selected);

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
            const summary = calendarMap.get(key);
            const dots = (summary?.priorities ?? [])
              .slice(0, 3)
              .map((p) => ACCENT_BG[PRIORITY_COLOR[p]]);

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
                dotColors={dots}
                dimDots={summary?.allCompleted ?? false}
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
              {total}개의 할 일
              {total > 0 && (
                <>
                  {" / "}
                  <span className="text-xs font-medium text-blue-500">
                    {completed}/{total}개 완료
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

        {error && <p className="mt-3 text-xs text-danger">{error}</p>}

        {groups.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-300">
            등록된 할 일이 없습니다.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2 pb-4">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  <span className={`h-2 w-2 rounded-full ${group.dot}`} />
                  <span className="text-sm font-semibold text-neutral-600">
                    {group.label}
                  </span>
                  <span className="text-xs text-neutral-300">
                    {group.completed}/{group.total}
                  </span>
                </div>
                {group.items.map((todo) => (
                  <ListItem
                    key={todo.id}
                    label={todo.title}
                    checked={todo.done}
                    chipLabel={todo.category}
                    chipColor={todo.color}
                    onToggle={() => toggleTodo(todo.id)}
                    onDelete={() => handleDeleteTodo(todo.id)}
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
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
