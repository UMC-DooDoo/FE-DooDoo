interface PageTitleProps {
  /** 작은 라벨 (예: MY TASKS, STATISTICS) */
  eyebrow: string;
  title: string;
}

function PageTitle({ eyebrow, title }: PageTitleProps) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-neutral-400">
        {eyebrow}
      </p>
      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
    </div>
  );
}

export default PageTitle;
