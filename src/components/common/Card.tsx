import type { ReactNode } from 'react'

interface CardProps {
  /** 있으면 카드 좌상단에 제목을 그린다 */
  title?: string
  children: ReactNode
  className?: string
}

function Card({ title, children, className = '' }: CardProps) {
  return (
    <section
      className={`border-border bg-bg rounded-lg border p-4 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-md font-semibold text-neutral-900">{title}</h2>
      )}
      {children}
    </section>
  )
}

export default Card
