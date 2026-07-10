import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`border-border bg-bg rounded-lg border p-4 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-md font-semibold text-neutral-900">{title}</h2>
      )}
      {children}
    </section>
  );
}

export default Card;
