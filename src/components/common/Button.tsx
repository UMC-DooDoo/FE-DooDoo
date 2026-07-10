import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button({ children, className = '', disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`text-md h-12 w-full rounded-xl font-semibold transition-colors ${
        disabled
          ? 'bg-neutral-100 text-neutral-300'
          : 'bg-blue-500 text-white active:bg-blue-600'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
