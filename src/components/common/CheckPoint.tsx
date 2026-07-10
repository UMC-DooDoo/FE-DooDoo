type CheckPointStatus = "valid" | "invalid" | "idle";

const STATUS_CLASS: Record<CheckPointStatus, string> = {
  valid: "text-success",
  invalid: "text-danger",
  idle: "text-neutral-300",
};

interface CheckPointProps {
  text: string;
  status?: CheckPointStatus;
}

function CheckPoint({ text, status = "valid" }: CheckPointProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${STATUS_CLASS[status]}`}
    >
      {status === "idle" ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle
            cx="6"
            cy="6"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6.5L4.5 9L10 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {text}
    </span>
  );
}

export default CheckPoint;
export type { CheckPointStatus };
