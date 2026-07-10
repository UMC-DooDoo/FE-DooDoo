import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Chip from "../common/Chip";
import { ACCENT_BG, ACCENT_COLORS } from "../../constants/category";
import type { AccentColor } from "../../constants/category";
import type { Category } from "../../types/todo";
import { ApiError } from "../../types/api";

interface AddCategoryModalProps {
  open: boolean;
  existingNames: string[];
  onClose: () => void;
  onSubmit: (cat: Category) => Promise<void>;
}

const MAX_NAME = 30;

function AddCategoryModal({
  open,
  existingNames,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<AccentColor>(ACCENT_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setColor(ACCENT_COLORS[0]);
      setSubmitting(false);
      setSubmitError(null);
    }
  }, [open]);

  const trimmed = name.trim();
  const duplicated = existingNames.includes(trimmed);
  const canSubmit = trimmed.length > 0 && !duplicated && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({ name: trimmed, color });
      // 성공하면 부모가 onClose 까지 호출한다.
    } catch (e) {
      // 모달은 열어둬서 재시도할 수 있게 한다.
      setSubmitError(
        e instanceof ApiError ? e.message : "분야 생성 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title="분야 추가" onClose={onClose}>
      {/* 분야 이름 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-neutral-600">분야 이름</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
          placeholder="놀기"
          className="h-12 w-full rounded-xl border border-transparent bg-neutral-50 px-4 text-sm outline-none placeholder:text-neutral-300 focus:border-blue-300"
        />
        {duplicated && (
          <span className="text-danger text-xs">이미 있는 분야예요</span>
        )}
      </label>

      {/* 색상 */}
      <span className="mt-4 block text-xs font-semibold text-neutral-600">
        색상
      </span>
      <div className="mt-2 flex flex-wrap gap-3">
        {ACCENT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full ${ACCENT_BG[c]} ${
              color === c ? "ring-2 ring-neutral-900 ring-offset-2" : ""
            }`}
          />
        ))}
      </div>

      {/* 미리보기 */}
      <div className="mt-4 flex items-center rounded-xl bg-neutral-50 px-4 py-3">
        <Chip label={trimmed || "놀기"} color={color} />
      </div>

      {submitError && (
        <p className="text-danger mt-3 text-xs">{submitError}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-6 h-12 w-full rounded-xl text-sm font-semibold ${
          canSubmit
            ? "bg-blue-500 text-white active:bg-blue-600"
            : "bg-neutral-100 text-neutral-300"
        }`}
      >
        {submitting ? "만드는 중..." : "분야 만들기"}
      </button>
    </Modal>
  );
}

export default AddCategoryModal;
