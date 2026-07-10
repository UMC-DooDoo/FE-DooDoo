import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "할 일" },
  { to: "/stats", label: "통계" },
];

function BottomNav() {
  return (
    <nav className="sticky bottom-0 border-t border-[var(--color-border)] bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex">
        {TABS.map(({ to, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `flex h-14 items-center justify-center text-sm ${
                  isActive
                    ? "font-semibold text-[var(--color-text)]"
                    : "text-[var(--color-text-sub)]"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNav;
