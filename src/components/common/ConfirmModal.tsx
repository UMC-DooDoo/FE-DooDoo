import { useConfirmModalStore } from '../../store/confirmModalStore'

function ConfirmModal() {
  const { isOpen, title, description, respond } = useConfirmModalStore()

  if (!isOpen) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={() => respond(false)}
    >
      <div
        className="w-full max-w-[280px] rounded-lg bg-white p-5 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-md font-bold text-neutral-900">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => respond(false)}
            className="h-11 flex-1 rounded-lg bg-neutral-100 text-sm font-semibold text-neutral-600"
          >
            아니오
          </button>
          <button
            type="button"
            onClick={() => respond(true)}
            className="h-11 flex-1 rounded-lg bg-blue-500 text-sm font-semibold text-white"
          >
            예
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
