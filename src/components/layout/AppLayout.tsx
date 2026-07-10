import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function AppLayout() {
  return (
    <div className="flex min-h-dvh justify-center bg-neutral-100">
      <div className="bg-bg flex min-h-dvh w-full max-w-[430px] flex-col">
        <main className="relative flex flex-1 flex-col">
          <Outlet />
        </main>
        <NavigationBar />
      </div>
    </div>
  );
}

export default AppLayout;
