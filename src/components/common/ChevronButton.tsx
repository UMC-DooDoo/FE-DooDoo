interface ChevronButtonProps {
  direction: "left" | "right";
  label: string;
  onClick?: () => void;
  className?: string;
}

const PATH = {
  left: "M12.5 15L7.5 10L12.5 5",
  right: "M7.5 5L12.5 10L7.5 15",
};

function ChevronButton({
  direction,
  label,
  onClick,
  className = "",
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`p-2 ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d={PATH[direction]}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default ChevronButton;
