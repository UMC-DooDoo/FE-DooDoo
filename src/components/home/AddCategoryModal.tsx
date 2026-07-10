import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Chip from "../common/Chip";
import type { ChipColor } from "../common/Chip";
import type { Category } from "../../types/todo";
import { CATEGORY_PALETTE, CHIP_SWATCH } from "../../types/todo";

interface AddCategoryModalProps {
  open: boolean;
  existingNames: string[];
  onClose: () => void;
  onSubmit: (cat: Category) => void;
}

const MAX_NAME = 30;

function AddCategoryModal({
  open,
  existingNames,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<ChipColor>(CATEGORY_PALETTE[0]);

  useEffect(() => {
    if (open) {
      setName("");
      setColor(CATEGORY_PALETTE[0]);
    }
  }, [open]);

  const trimmed = name.trim();
  const duplicated = existingNames.includes(trimmed);
  const canSubmit = trimmed.length > 0 && !duplicated;

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
        {CATEGORY_PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full ${CHIP_SWATCH[c]} ${
              color === c ? "ring-2 ring-neutral-900 ring-offset-2" : ""
            }`}
          />
        ))}
      </div>

      {/* 미리보기 */}
      <div className="mt-4 flex items-center rounded-xl bg-neutral-50 px-4 py-3">
        <Chip label={trimmed || "놀기"} color={color} />
      </div>

      <button
        type="button"
        onClick={() => canSubmit && onSubmit({ name: trimmed, color })}
        disabled={!canSubmit}
        className={`mt-6 h-12 w-full rounded-xl text-sm font-semibold ${
          canSubmit
            ? "bg-blue-500 text-white active:bg-blue-600"
            : "bg-neutral-100 text-neutral-300"
        }`}
      >
        분야 만들기
      </button>
    </Modal>
  );
}

export default AddCategoryModal;
