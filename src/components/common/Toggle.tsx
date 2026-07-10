interface ToggleProps {
  options: [string, string]
  value: string
  onChange: (value: string) => void
}

function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-neutral-100 p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`min-w-12 rounded-full px-3 py-1.5 text-sm transition-colors ${
            value === option
              ? 'bg-blue-500 font-semibold text-white'
              : 'text-neutral-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default Toggle
