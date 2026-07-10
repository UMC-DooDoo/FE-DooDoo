import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Chip from "../common/Chip";
import { confirmModal } from "../../store/confirmModalStore";
import { ACCENT_BG } from "../../constants/category";
import { PRIORITIES, PRIORITY_COLOR } from "../../constants/priority";
import type { Priority } from "../../constants/priority";
import type { Category } from "../../types/todo";

interface AddTaskModalProps {
  open: boolean;
  categories: Category[];
  /** 방금 추가된 분야 이름 — 있으면 자동 선택 */
  selectHint: string | null;
  onClose: () => void;
  onRequestAddCategory: () => void;
  onSubmit: (data: { title: string; category: string; priority: Priority }) => void;
}

const MAX_TITLE = 30;

function AddTaskModal({
  open,
  categories,
  selectHint,
  onClose,
  onRequestAddCategory,
  onSubmit,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>(1);

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("");
      setPriority(1);
    }
  }, [open]);

  // 새 분야가 추가되면 자동 선택
  useEffect(() => {
    if (selectHint) setCategory(selectHint);
  }, [selectHint]);

  const canSubmit = title.trim().length > 0 && category !== "";

  async function attemptClose() {
    if (!title.trim() && !category) {
      onClose();
      return;
    }
    const ok = await confirmModal({
      title: "정말 닫으시겠습니까?",
      description: "닫으면 입력한 내용은 사라집니다.",
    });
    if (ok) onClose();
  }

  return (
    <Modal open={open} title="할 일 추가" onClose={attemptClose}>
      {/* 할 일 입력 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-neutral-600">할 일</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
          placeholder="할 일을 입력하세요"
          className="h-12 w-full rounded-xl border border-transparent bg-neutral-50 px-4 text-sm outline-none placeholder:text-neutral-300 focus:border-blue-300"
        />
      </label>

      {/* 분야 */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-600">분야</span>
        <button
          type="button"
          onClick={onRequestAddCategory}
          className="text-xs font-semibold text-blue-500"
        >
          + 분야 추가
        </button>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto p-1">
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setCategory(c.name)}
            className="shrink-0"
          >
            <Chip label={c.name} color={c.color} selected={category === c.name} />
          </button>
        ))}
      </div>

      {/* 우선순위 */}
      <span className="mt-4 block text-xs font-semibold text-neutral-600">
        우선순위
      </span>
      <div className="mt-2 flex gap-2">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              priority === p
                ? `${ACCENT_BG[PRIORITY_COLOR[p]]} text-white`
                : "bg-neutral-50 text-neutral-400"
            }`}
          >
            {p}순위
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          canSubmit && onSubmit({ title: title.trim(), category, priority })
        }
        disabled={!canSubmit}
        className={`mt-6 h-12 w-full rounded-xl text-sm font-semibold ${
          canSubmit
            ? "bg-blue-500 text-white active:bg-blue-600"
            : "bg-neutral-100 text-neutral-300"
        }`}
      >
        추가하기
      </button>
    </Modal>
  );
}

export default AddTaskModal;
