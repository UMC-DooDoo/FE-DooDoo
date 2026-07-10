import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

function Input({ error = false, className = '', ...rest }: InputProps) {
  return (
    <input
      className={`h-12 w-full rounded-xl px-4 text-base outline-none placeholder:text-neutral-300 ${
        error
          ? 'border border-danger bg-white'
          : 'border border-transparent bg-neutral-50 focus:border-blue-300'
      } ${className}`}
      {...rest}
    />
  )
}

export default Input
