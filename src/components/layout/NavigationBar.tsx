import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const TABS: { to: string; label: string; icon: ReactNode }[] = [
  {
    to: "/",
    label: "할 일",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="4" width="15" height="13.5" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 8.5H17.5M6.5 2V5M13.5 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/stats",
    label: "통계",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 17V11M10 17V5M16 17V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function NavigationBar() {
  return (
    <nav className="border-border bg-bg sticky bottom-0 border-t pb-[env(safe-area-inset-bottom)]">
      <ul className="flex">
        {TABS.map(({ to, label, icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] ${
                  isActive ? "font-semibold text-blue-500" : "text-neutral-300"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationBar;
