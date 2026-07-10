interface CheckPointProps {
  text: string
  valid?: boolean
}

function CheckPoint({ text, valid = true }: CheckPointProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        valid ? 'text-success' : 'text-danger'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6.5L4.5 9L10 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </span>
  )
}

export default CheckPoint
