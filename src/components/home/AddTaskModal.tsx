import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Chip from "../common/Chip";
import type { Category, Priority } from "../../types/todo";
import { PRIORITY_META } from "../../types/todo";

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
  const [confirmClose, setConfirmClose] = useState(false);

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("");
      setPriority(1);
      setConfirmClose(false);
    }
  }, [open]);

  // 새 분야가 추가되면 자동 선택
  useEffect(() => {
    if (selectHint) setCategory(selectHint);
  }, [selectHint]);

  const canSubmit = title.trim().length > 0 && category !== "";

  function attemptClose() {
    if (title.trim() || category) setConfirmClose(true);
    else onClose();
  }

  return (
    <>
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
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCategory(c.name)}
              className={`shrink-0 rounded-full transition ${
                category === c.name ? "ring-2 ring-blue-500 ring-offset-1" : ""
              }`}
            >
              <Chip label={c.name} color={c.color} />
            </button>
          ))}
        </div>

        {/* 우선순위 */}
        <span className="mt-4 block text-xs font-semibold text-neutral-600">
          우선순위
        </span>
        <div className="mt-2 flex gap-2">
          {([1, 2, 3, 4] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                priority === p
                  ? `${PRIORITY_META[p].dot} text-white`
                  : "bg-neutral-50 text-neutral-400"
              }`}
            >
              {PRIORITY_META[p].label}
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

      {/* 닫기 확인 */}
      {confirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
          <button
            type="button"
            aria-label="취소"
            className="absolute inset-0 bg-black/30"
            onClick={() => setConfirmClose(false)}
          />
          <div className="relative z-10 w-full max-w-[280px] rounded-2xl bg-white p-5 text-center">
            <p className="text-sm font-semibold">정말 닫으시겠어요?</p>
            <p className="mt-1 text-xs text-neutral-400">
              입력한 내용은 저장되지 않아요
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClose(false)}
                className="flex-1 rounded-lg bg-neutral-100 py-2 text-xs font-semibold text-neutral-500"
              >
                계속 작성
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmClose(false);
                  onClose();
                }}
                className="bg-danger flex-1 rounded-lg py-2 text-xs font-semibold text-white"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddTaskModal;
