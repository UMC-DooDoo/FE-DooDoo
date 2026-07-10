import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

function AppLayout() {
  return (
    <div className="flex min-h-dvh justify-center bg-[var(--neutral-100)]">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col bg-[var(--color-bg)]">
        <main className="relative flex flex-1 flex-col">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default AppLayout;
