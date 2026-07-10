import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../common/TabBar";

const TABS = [
  { to: "/", label: "할 일" },
  { to: "/stats", label: "통계" },
];

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const active =
    TABS.find((tab) => tab.to === location.pathname)?.label ?? TABS[0].label;

  function handleChange(label: string) {
    const tab = TABS.find((t) => t.label === label);
    if (tab) navigate(tab.to);
  }

  return (
    <nav className="border-border bg-bg sticky bottom-0 border-t pb-[env(safe-area-inset-bottom)]">
      <TabBar
        tabs={TABS.map((t) => t.label)}
        active={active}
        onChange={handleChange}
      />
    </nav>
  );
}

export default NavigationBar;
